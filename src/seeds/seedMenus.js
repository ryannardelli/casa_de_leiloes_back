const Menu = require("../models/Menu");

async function seedMenus() {
  const menus = [
    // --- Menus do Leiloeiro (AUCTIONEER) ---
    {
      key: "auctioneer-dashboard",
      name: "Visão geral",
      route: "/auctioneer/dashboard",
      icon: "LayoutDashboard",
      order: 1,
    },
    {
      key: "auctioneer-lots",
      name: "Meus lotes",
      route: "/auctioneer/lots",
      icon: "Package",
      order: 2,
    },
    {
      key: "auctioneer-create-lot",
      name: "Criar lote",
      route: "/auctioneer/lots/new",
      icon: "PlusCircle",
      order: 3,
    },
    {
      key: "auctioneer-active-auctions",
      name: "Leilões ativos",
      route: "/auctioneer/active-auctions",
      icon: "Gavel",
      order: 4,
    },
    {
      key: "auctioneer-results",
      name: "Resultados",
      route: "/auctioneer/results",
      icon: "History",
      order: 5,
    },
    {
      key: "auctioneer-profile",
      name: "Meu perfil",
      route: "/auctioneer/profile",
      icon: "UserRound",
      order: 6,
    },

    // --- Menus do Licitante (BIDDER) ---
    {
      key: "bidder-dashboard",
      name: "Visão geral",
      route: "/bidder/dashboard",
      icon: "LayoutDashboard",
      order: 7,
    },
    {
      key: "bidder-my-bids",
      name: "Meus lances",
      route: "/bidder/my-bids",
      icon: "Gavel",
      order: 8,
    },

    {
      key: "bidder-lots",
      name: "Vitrine de lotes",
      route: "/bidder/lots",
      icon: "Store",
      order: 9,
    },

    {
      key: "bidder-wallet",
      name: "Minha carteira",
      route: "/bidder/wallet",
      icon: "Wallet",
      order: 10,
    },
    {
      key: "bidder-my-wins",
      name: "Meus arremates",
      route: "/bidder/my-wins",
      icon: "Trophy",
      order: 11,
    },
    {
      key: "bidder-profile",
      name: "Meu perfil",
      route: "/bidder/profile",
      icon: "UserRound",
      order: 12,
    },

    // --- Menus do Administrador (ADMIN) ---
     {
      key: "admin-home",
      name: "Visão geral",
      route: "/admin/dashboard",
      icon: "LayoutDashboard",
      order: 13,
    },

    {
      key: "admin-users",
      name: "Usuários",
      route: "/admin/users",
      icon: "UsersRound",
      order: 14,
    },

    { key: "admin-menus", name: "Menus", route: "/admin/menus", icon: "Layers", order: 15 },

     { key: "admin-profiles", name: "Perfis", route: "/admin/profiles", icon: "Users", order: 16 },
  ];

  for (const menu of menus) {
    await Menu.upsert({
      key: menu.key,
      name: menu.name,
      route: menu.route,
      icon: menu.icon,
      order: menu.order ?? 999,
    });
  }
}

module.exports = seedMenus;