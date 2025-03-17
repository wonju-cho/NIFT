const Migrations = artifacts.require("Migrations");

contract("Migrations", (accounts) => {
  it("should deploy successfully", async () => {
    const instance = await Migrations.deployed();
    assert(instance.address !== "");
  });
});
