const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const os = require("os");
const crypto = require("crypto");
const http = require("http");

const app = require("./app");

const sequelize = require("./configs/database");

const seedProfiles = require("./seeds/profile.seed");
const seedMenus = require("./seeds/seedMenus");
const seedProfileMenu = require("./seeds/profileMenu");
const createInitialAdmin = require("./seeds/admin.seed");

const { initializeSocket } = require("./configs/socket");

const PORT = process.env.PORT || 3000;

if (!global.crypto) {
  global.crypto = crypto.webcrypto;
}

global.crypto.randomUUID ??= crypto.randomUUID;

async function connectDatabase() {
  try {
    await sequelize.authenticate();

    console.log("Conectado ao banco de dados com sucesso!");

    const Menu = require("./models/Menu");
    const ProfileMenu = require("./models/ProfileMenu");
    const User = require("./models/User");
    const Profile = require("./models/Profile");
    const AuditCheckpoint = require("./models/AuditCheckpoint");
    const Bid = require("./models/Bid");
    const Lot = require("./models/Lot");
    const Receipt = require("./models/Receipt");
    const Wallet = require("./models/Wallet");
    const Transaction = require("./models/Transaction");

    User.belongsTo(Profile, {
      foreignKey: "profileId",
      as: "Profile"
    });

    Profile.hasMany(User, {
        foreignKey: "profileId",
        as: "users"
    });

    Profile.belongsToMany(Menu, {
      through: ProfileMenu,
      foreignKey: "profileId",
    });

    Menu.belongsToMany(Profile, {
      through: ProfileMenu,
      foreignKey: "menuId",
    });

    User.hasMany(Lot, {
      foreignKey: "auctioneerId",
      as: "lots",
    });

    Lot.belongsTo(User, {
        foreignKey: "auctioneerId",
        as: "auctioneer",
    });

    Lot.hasMany(Bid, {
        foreignKey: "lotId",
        as: "bids",
    });

    Bid.belongsTo(Lot, {
        foreignKey: "lotId",
        as: "lot",
    });

    User.hasMany(Bid, {
        foreignKey: "bidderId",
        as: "bids",
    });

    Bid.belongsTo(User, {
        foreignKey: "bidderId",
        as: "bidder",
    });

    User.hasOne(Wallet, {
        foreignKey: "userId",
        as: "wallet",
    });

    Wallet.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
    });

    Wallet.hasMany(Transaction, {
        foreignKey: "walletId",
        as: "transactions",
    });

    Transaction.belongsTo(Wallet, {
        foreignKey: "walletId",
        as: "wallet",
    });

    Lot.hasOne(Receipt, {
        foreignKey: "lotId",
        as: "receipt",
    });

    Receipt.belongsTo(Lot, {
        foreignKey: "lotId",
        as: "lot",
    });

    Lot.hasMany(AuditCheckpoint, {
        foreignKey: "lotId",
        as: "auditCheckpoints",
    });

    AuditCheckpoint.belongsTo(Lot, {
        foreignKey: "lotId",
        as: "lot",
    });

    await sequelize.sync();

    console.log("Tabelas e associações sincronizadas com sucesso!");

    const profilesCount = await Profile.count();
    const menusCount = await Menu.count();

    if (profilesCount === 0) {
      console.log("Criando profiles iniciais...");

      await seedProfiles();

      console.log("Profiles criados com sucesso!");
    }

    if (menusCount === 0) {
      console.log("Criando menus iniciais...");

      await seedMenus();

      console.log("Menus criados com sucesso!");
    }

    await seedProfileMenu();

    console.log("Seeds executados com sucesso!");

    await createInitialAdmin();

    const server = http.createServer(app);
    initializeSocket(server, app);

    server.listen(PORT, "0.0.0.0", () => {
      const networkInterfaces = os.networkInterfaces();

      let localIP = "localhost";

      for (const interfaceName in networkInterfaces) {
        for (const net of networkInterfaces[interfaceName]) {
          if (net.family === "IPv4" && !net.internal) {
            localIP = net.address;
          }
        }
      }

      console.log(`
          Servidor rodando com sucesso!

          Local:   http://localhost:${PORT}

          Swagger: http://localhost:${PORT}/api-docs/

          Rede:    http://${localIP}:${PORT}
      `);
    });

  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);

    process.exit(1);
  }
}

connectDatabase();