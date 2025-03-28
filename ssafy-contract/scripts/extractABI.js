const hre = require("hardhat");
const { artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path"); // 이 줄이 추가되어야 합니다.

async function main() {
  const contractName = "GifticonNFT"; // 추출하려는 컨트랙트 이름으로 변경하세요

  try {
    const artifact = await artifacts.readArtifact(contractName);

    // ABI 추출 및 JSON 파일로 저장
    const abi = artifact.abi;
    const abiFilePath = path.join(__dirname, `${contractName}.abi`);
    fs.writeFileSync(abiFilePath, JSON.stringify(abi, null, 2));
    console.log(`ABI 파일이 생성되었습니다: ${abiFilePath}`);

    // 바이트코드 추출 및 텍스트 파일로 저장 (deployable bytecode)
    const bytecode = artifact.bytecode;
    const bytecodeFilePath = path.join(__dirname, `${contractName}.bin`);
    fs.writeFileSync(bytecodeFilePath, bytecode);
    console.log(`바이트코드 파일이 생성되었습니다: ${bytecodeFilePath}`);
  } catch (error) {
    console.error("Artifact를 읽는 데 실패했습니다:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
