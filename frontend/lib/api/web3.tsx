import { ethers } from "ethers";

// ✅ 환경 변수에서 컨트랙트 주소 가져오기
export const SSF_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_SSF_CONTRACT_ADDRESS || "";
export const NFT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "";

// ✅ SSF 토큰 및 NFT 컨트랙트 ABI
const SSF_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const NFT_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])",
  "function uri(uint256 id) view returns (string)",
  "function purchaseBySerial(uint256 serialNumber)",
  "function getSerialInfo(uint256 serialNumber) view returns (uint256 price, address seller, address owner, uint256 expirationDate, bool isRedeemed, uint256 redeemedAt)",
  "function getTokenIdBySerial(uint256 serialNumber) view returns (uint256)",
  "function getTokenInfo(uint256 tokenId) view returns (string name, string description, uint256 totalSupply, string metadataURI)",
  "function isApprovedForAll(address account, address operator) view returns (bool)",
];

// const ETH_ABI = [
//   "function balanceOf(address account, uint256 id) view returns (uint256)",
//   "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])",
//   "function uri(uint256 id) view returns (string)",
//   "function purchaseBySerial(uint256 serialNumber) payable", // payable로 변경
//   "function getSerialInfo(uint256 serialNumber) view returns (uint256 price, address seller, address owner, uint256 expirationDate, bool isRedeemed, uint256 redeemedAt)",
//   "function getTokenIdBySerial(uint256 serialNumber) view returns (uint256)",
//   "function getTokenInfo(uint256 tokenId) view returns (string name, string description, uint256 totalSupply, string metadataURI)",
// ];

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

export async function isSellerApprovedForSerial(
  serialNumber: number
): Promise<boolean> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  if (!provider) return false;

  try {
    const signer = await provider.getSigner();
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_ABI,
      signer
    );

    // 시리얼 넘버로부터 판매자 주소 조회
    const [, seller] = await nftContract.getSerialInfo(serialNumber);

    // 판매자가 NFT 컨트랙트에 전송 권한을 위임했는지 확인
    const isApproved = await nftContract.isApprovedForAll(
      seller,
      NFT_CONTRACT_ADDRESS
    );
    console.log(`🔍 판매자 ${seller} 의 approval 상태:`, isApproved);

    return isApproved;
  } catch (error) {
    console.error("❌ approval 상태 확인 실패:", error);
    return false;
  }
}

export async function buyNFT(serialNumber: number): Promise<boolean> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  if (!provider) return false;

  try {
    const signer = await provider.getSigner();

    if (!NFT_CONTRACT_ADDRESS || !SSF_CONTRACT_ADDRESS) {
      console.error("❌ 컨트랙트 주소가 설정되지 않았습니다.");
      return false;
    }

    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_ABI,
      signer
    );
    const ssfToken = new ethers.Contract(SSF_CONTRACT_ADDRESS, SSF_ABI, signer);

    const [price, seller, owner, expirationDate, isRedeemed, redeemedAt] =
      (await nftContract.getSerialInfo(serialNumber)) as [
        bigint,
        string,
        string,
        bigint,
        boolean,
        bigint
      ];

    console.log("🔍 [getSerialInfo 결과]");
    console.log("▶ serialNumber:", serialNumber);
    console.log("▶ price:", price.toString());
    console.log("▶ seller:", seller);
    console.log("▶ owner:", owner);
    console.log(
      "▶ expirationDate:",
      new Date(Number(expirationDate) * 1000).toLocaleString()
    );
    console.log("▶ isRedeemed:", isRedeemed);
    console.log("▶ redeemedAt:", redeemedAt.toString());
    const tokenId = await nftContract.getTokenIdBySerial(serialNumber);
    const sellerBalance = await nftContract.balanceOf(seller, tokenId);
    console.log(`🎯 판매자 보유 수량:`, sellerBalance.toString());

    const isApproved = await isSellerApprovedForSerial(serialNumber);
    if (!isApproved) {
      throw new Error("❌ 판매자가 NFT 전송 권한을 위임하지 않았습니다.");
    }

    if (seller === ethers.ZeroAddress) {
      throw new Error("❌ 판매되지 않은 NFT입니다.");
    }
    if (isRedeemed) {
      throw new Error("❌ 이미 사용된 NFT입니다.");
    }
    if (price <= 0n) {
      throw new Error("❌ 가격이 설정되지 않은 NFT입니다.");
    }

    const buyer = await signer.getAddress();
    const ssfBalance: bigint = await ssfToken.balanceOf(buyer);
    const allowance: bigint = await ssfToken.allowance(
      buyer,
      NFT_CONTRACT_ADDRESS
    );

    console.log("🔐 [구매자 정보]");
    console.log("👤 구매자:", buyer);
    console.log("💰 SSF 잔액:", ssfBalance.toString());
    console.log("🧾 결제 금액:", price.toString());
    console.log("🔓 승인 허용량:", allowance.toString());

    if (ssfBalance < price) {
      throw new Error("❌ SSF 잔액이 부족합니다.");
    }

    if (allowance < price) {
      console.log("⚠️ 허용량 부족. approve 실행 중...");
      const approveTx = await ssfToken.approve(NFT_CONTRACT_ADDRESS, price);
      await approveTx.wait();
      console.log("✅ 토큰 승인 완료");
    } else {
      console.log("✅ 승인량 충분. approve 생략");
    }

    console.log("🚀 NFT 구매 트랜잭션 실행 시작...");
    const tx = await nftContract.purchaseBySerial(serialNumber);
    console.log("⏳ 트랜잭션 전송됨. 대기 중...");
    await tx.wait();
    console.log("✅ SSF로 NFT 구매 완료");

    return true;
  } catch (error) {
    console.error("❌ NFT 구매 실패:", error);

    // 📌 추가 디버그
    // if (error.code === "CALL_EXCEPTION" || error.code === -32603) {
    //   console.warn(
    //     "⚠️ 스마트 컨트랙트에서 revert 발생 → require() 조건 확인 필요"
    //   );
    // }

    return false;
  }
}

// export async function buyETH(serialNumber: number): Promise<boolean> {
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   if (!provider) return false;

//   try {
//     const signer = await provider.getSigner();

//     if (!NFT_CONTRACT_ADDRESS) {
//       console.error("❌ 컨트랙트 주소가 설정되지 않았습니다.");
//       return false;
//     }

//     const nftContract = new ethers.Contract(
//       NFT_CONTRACT_ADDRESS,
//       ETH_ABI,
//       signer
//     );

//     const [price, seller, owner, expirationDate, isRedeemed, redeemedAt] =
//       (await nftContract.getSerialInfo(serialNumber)) as [
//         bigint,
//         string,
//         string,
//         bigint,
//         boolean,
//         bigint
//       ];

//     if (seller === ethers.ZeroAddress) {
//       throw new Error("❌ 판매되지 않은 NFT입니다.");
//     }
//     if (isRedeemed) {
//       throw new Error("❌ 이미 사용된 NFT입니다.");
//     }
//     if (price <= 0n) {
//       throw new Error("❌ 가격이 설정되지 않은 NFT입니다.");
//     }

//     const buyer = await signer.getAddress();

//     console.log("💰 구매 금액 (ETH):", ethers.formatUnits(price, 18));
//     console.log(`NFT 가격 (ETH): ${ethers.formatUnits(price, 18)}`);
//     const balance = await provider.getBalance(buyer);
//     console.log(
//       `보유한 이더리움 잔액 (ETH): ${ethers.formatUnits(balance, 18)}`
//     );

//     if (balance < price) {
//       console.error("❌ 이더리움 잔액이 부족합니다.");
//       return false;
//     }

//     // ✅ 컨트랙트에 직접 결제하며 호출
//     const tx = await nftContract.purchaseBySerial(serialNumber, {
//       value: price, // 컨트랙트가 price만큼 받음
//     });

//     await tx.wait();
//     console.log("✅ NFT 구매 완료");

//     return true;
//   } catch (error) {
//     console.error("❌ NFT 구매 실패:", error);
//     return false;
//   }
// }

export async function fetchTokenInfoBySerial(serialNumber: number) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_ABI,
      signer
    );

    const tokenId = await nftContract.getTokenIdBySerial(serialNumber);
    const [name, description, totalSupply, metadataURI] =
      await nftContract.getTokenInfo(tokenId);

    return {
      tokenId,
      name,
      description,
      totalSupply,
      metadataURI,
    };
  } catch (error) {
    console.error("❌ [fetchTokenInfoBySerial] 토큰 정보 조회 실패:", error);
    return null;
  }
}
