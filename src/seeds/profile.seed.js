const Profile = require('../models/Profile');

async function seedProfiles() {
  const profiles = [
    {
      name: "Administrador",
      description: "Responsável pela administração geral da plataforma, incluindo o gerenciamento de usuários, perfis de acesso e permissões",
      system: true
    },

    {
      name: "Leiloeiro",
      description: "Responsável por montar e gerenciar lotes de leilão, definir valores iniciais, incrementos e acompanhar resultados.",
      system: true
    },

    {
      name: "Licitante",
      description: "Usuário da plataforma que realiza depósitos simulados na carteira, acompanha salas de leilões ao vivo, dá lances e arremata itens.",
      system: true
    }
  ];

  for (const profile of profiles) {
    await Profile.findOrCreate({
      where: { name: profile.name },
      defaults: profile
    });
  }
}

module.exports = seedProfiles;