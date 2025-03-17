import { ethers } from "ethers";

// SSF 토큰 컨트랙트 정보
const SSF_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SSF_CONTRACT_ADDRESS!;
const SSF_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

/**
 * 사용자의 SSF 토큰 잔액 가져오기
 * @param userAddress - 조회할 사용자 지갑 주소
 * @returns {Promise<string>} - 잔액을 문자열로 반환
 */
export async function getSSFBalance(userAddress: string): Promise<string> {
  if (!window.ethereum) {
    console.error("Metamask가 설치되지 않음");
    return "0";
  }

  try {
    // 메타마스크 프로바이더 설정
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // 지갑 연결 요청

    // SSF 컨트랙트 인스턴스 생성
    const contract = new ethers.Contract(SSF_CONTRACT_ADDRESS, SSF_ABI, provider);

    // 사용자 SSF 잔액 가져오기
    const balance = await contract.balanceOf(userAddress);
    const decimals = await contract.decimals(); // 소수점 자리수 가져오기

    // 소수점 자리수 반영해서 변환
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error("SSF 잔액 조회 실패:", error);
    return "0";
  }
}
