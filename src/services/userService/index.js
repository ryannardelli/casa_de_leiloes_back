const UserNotFoundError = require("../../exceptions/domain/users/UserNotFoundError");

const userRepository = require('../../repositories/userRepoistory');

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

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };