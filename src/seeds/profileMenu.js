const Profile = require("../models/Profile");
const Menu = require("../models/Menu");
const ProfileMenu = require("../models/ProfileMenu");

async function seedProfileMenus() {
   const admin = await Profile.findOne({
    where: { name: "Administrador" },
  });

  const leiloeiro = await Profile.findOne({
    where: { name: "Leiloeiro" },
  });

  const licitante = await Profile.findOne({
    where: { name: "Licitante" },
  });

   if (!admin) {
    throw new Error('Profile "Administrador" não encontrado.');
  }

  if (!leiloeiro) {
    throw new Error('Profile "Leiloeiro" não encontrado.');
  }

  if (!licitante) {
    throw new Error('Profile "Licitante" não encontrado.');
  }

  // Menus exclusivos do Administrador
    const adminMenuKeys = [
    "admin-home",
    "admin-users",
    "admin-menus",
    "admin-profiles",
  ];

  for (const key of adminMenuKeys) {
    const menu = await Menu.findOne({
      where: { key },
    });

    if (!menu) {
      console.warn(`Menu "${key}" não encontrado.`);
      continue;
    }

    await ProfileMenu.findOrCreate({
      where: {
        profileId: admin.id,
        menuId: menu.id,
      },
    });
  }

  
  const leiloeiroMenuKeys = [
    "auctioneer-dashboard",
    "auctioneer-lots",
    "auctioneer-create-lot",
    "auctioneer-active-auctions",
    "auctioneer-results",
    "auctioneer-profile",
  ];

  for (const key of leiloeiroMenuKeys) {
    const menu = await Menu.findOne({
      where: { key },
    });

    if (!menu) {
      console.warn(`Menu "${key}" não encontrado.`);
      continue;
    }

    await ProfileMenu.findOrCreate({
      where: {
        profileId: leiloeiro.id,
        menuId: menu.id,
      },
    });
  }

  // Menus exclusivos do Licitante
  const licitanteMenuKeys = [
    "bidder-dashboard",
    "bidder-my-bids",
    "bidder-lots",
    "bidder-wallet",
    "bidder-my-wins",
    "bidder-profile",
  ];

  for (const key of licitanteMenuKeys) {
    const menu = await Menu.findOne({
      where: { key },
    });

    if (!menu) {
      console.warn(`Menu "${key}" não encontrado.`);
      continue;
    }

    await ProfileMenu.findOrCreate({
      where: {
        profileId: licitante.id,
        menuId: menu.id,
      },
    });
  }

  console.log("Relações entre profiles e menus de leilão criadas com sucesso!");
}

module.exports = seedProfileMenus;