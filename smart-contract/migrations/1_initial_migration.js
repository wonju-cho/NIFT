const Migrations = artifacts.require("Migrations");

<<<<<<< HEAD
module.exports = async function (deployer) {
  await deployer.deploy(Migrations);
  const instance = await Migrations.deployed();
  console.log("✅ Migrations deployed at:", instance.address);
=======
module.exports = function (deployer) {
  deployer.deploy(Migrations);
>>>>>>> 0d4bb62 (Feat: init smart-contract)
};
