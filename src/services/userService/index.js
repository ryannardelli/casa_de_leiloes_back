const UserNotFoundError = require("../../exceptions/domain/users/UserNotFoundError");

const ProfileNotFoundError = require("../../exceptions/domain/profile/ProfileNotFoundError");

const userRepository = require('../../repositories/userRepoistory');
const profileRepository = require('../../repositories/profileRepository');

async function getAllUsers() {
    return userRepository.findAll();
}

async function getUserById(id) {
    const user = await userRepository.findById(id);
    if(!user) throw new UserNotFoundError();
    
    return user;
}

async function updateUser(updateDto) {
    const { id, ...updatedData } = updateDto;
    const user = await userRepository.findById(id);

    if(!user) throw new UserNotFoundError();

    await user.update(updatedData);
    return user.get({ plain: true });
}

async function deleteUser(id) {
    const user = await userRepository.findById(id);

    if (!user) throw new UserNotFoundError();

    await userRepository.delete(user);
    return { message: "Usuário excluído com sucesso!" };
}

async function updateUserProfile(userId, profileId) {
    const user = await userRepository.findById(userId);
    if(!user) throw new UserNotFoundError();

    const profile = await profileRepository.findById(profileId);
    if(!profile) throw new ProfileNotFoundError();

    user.profileId = profile.id;

    switch(profile.name) {
        case 'Administrador':
            user.role = 'admin';
            break;
        default:
            user.role = 'user';
    }

    await userRepository.save(user);

    return user;

}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, updateUserProfile };