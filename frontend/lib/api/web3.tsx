import { ethers } from "ethers";

// ✅ 환경 변수에서 컨트랙트 주소 가져오기
export const SSF_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_SSF_CONTRACT_ADDRESS || "";
export const NFT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "";

// ✅ SSF 토큰 및 NFT 컨트랙트 ABI
const SSF_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const NFT_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])",
  "function uri(uint256 id) view returns (string)",
];

// ✅ IPFS URL을 변환하는 함수
const convertIpfsUrl = (url: string) => {
  if (!url) return "/placeholder.svg";
  if (url.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${url.substring(7)}`;
  }
  return url;
};

/**
 * ✅ Metamask 연결 및 provider 반환
 * @returns {Promise<ethers.BrowserProvider | null>}
 */
async function getProvider(): Promise<ethers.BrowserProvider | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    console.error("Metamask가 설치되지 않음");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // 지갑 연결 요청
    return provider;
  } catch (error) {
    console.error("Metamask 연결 실패:", error);
    return null;
  }
}

/**
 * ✅ 사용자의 SSF 토큰 잔액 가져오기
 * @param userAddress - 조회할 사용자 지갑 주소
 * @returns {Promise<string>} - 잔액을 문자열로 반환
 */
export async function getSSFBalance(userAddress: string): Promise<string> {
  const provider = await getProvider();
  if (!provider) return "0";

  try {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(SSF_CONTRACT_ADDRESS, SSF_ABI, signer);

    const balance = await contract.balanceOf(userAddress);
    const decimals = await contract.decimals();
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error("SSF 잔액 조회 실패:", error);
    return "0";
  }
}

/**
 * ✅ 사용자의 NFT 기프티콘 목록을 JSON 형식으로 가져오기
 * @param userAddress - 조회할 사용자 지갑 주소
 * @param tokenIds - 조회할 NFT 토큰 ID 배열 (예: [1, 2, 3, 4, 5])
 * @returns {Promise<any[]>} - NFT 기프티콘 JSON 데이터
 */
// ✅ NFT 메타데이터 가져오기
export const fetchMetadata = async (metadataUrl: string) => {
  try {
    const response = await fetch(convertIpfsUrl(metadataUrl));
    const metadata = await response.json();

    // ✅ attributes에서 필요한 정보 추출
    const attributes = metadata.attributes || [];
    const brandAttr = attributes.find(
      (attr: any) => attr.trait_type === "Brand"
    );
    const expiryAttr = attributes.find(
      (attr: any) => attr.trait_type === "Valid Until"
    );
    const serialAttr = attributes.find(
      (attr: any) => attr.trait_type === "Gifticon Code"
    );

    return {
      id: metadata.id || "Unknown", // 메타데이터에 ID가 없는 경우 대비
      serialNum: serialAttr ? serialAttr.value : `NFT-${Math.random()}`, // 시리얼 넘버 없으면 랜덤 생성
      title: metadata.name || `NFT 기프티콘`,
      brand: brandAttr ? brandAttr.value : "알 수 없음",
      category: "디지털 상품권",
      expiryDate: expiryAttr ? expiryAttr.value : "무제한",
      image: convertIpfsUrl(metadata.image), // IPFS 이미지 변환
    };
  } catch (error) {
    console.error("❌ NFT 메타데이터 로딩 실패:", error);
    return null;
  }
};

// ✅ 사용자의 NFT 기프티콘 목록을 가져오기
export async function getUserNFTsAsJson(
  userAddress: string,
  tokenIds: number[]
): Promise<any[]> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  if (!provider) return [];

  try {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);

    const balances = await contract.balanceOfBatch(
      Array(tokenIds.length).fill(userAddress),
      tokenIds
    );

    const nftData = await Promise.all(
      tokenIds.map(async (id, index) => {
        const amount = Number(balances[index]);
        if (amount === 0) return null;

        const metadataUrl = await contract.uri(id);
        const metadata = await fetchMetadata(metadataUrl);
        if (!metadata) return null;

        return metadata; // ✅ 메타데이터에서 직접 추출한 정보 사용
      })
    );

    return nftData.filter((nft) => nft !== null);
  } catch (error) {
    console.error("❌ NFT 조회 실패:", error);
    return [];
  }
}
