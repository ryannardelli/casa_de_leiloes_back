const Profile = require("../models/Profile");
const Menu = require("../models/Menu");
const ProfileMenu = require("../models/ProfileMenu");

async function seedProfileMenus() {
  const leiloeiro = await Profile.findOne({
    where: { name: "LEILOEIRO" },
  });

  const licitante = await Profile.findOne({
    where: { name: "LICITANTE" },
  });

  if (!leiloeiro) {
    throw new Error('Profile "LEILOEIRO" não encontrado.');
  }

  if (!licitante) {
    throw new Error('Profile "LICITANTE" não encontrado.');
  }

  // Menus exclusivos do Leiloeiro
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