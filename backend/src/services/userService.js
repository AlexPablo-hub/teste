const { pool } = require('../config/database');

class UserService {
  async findOrCreateUser(firebaseUser) {
    try {
      // Verificar se usuário já existe
      const [existingUser] = await pool.execute(
        'SELECT * FROM usuarios WHERE firebase_uid = ?',
        [firebaseUser.uid]
      );

      if (existingUser.length > 0) {
        // Atualizar informações se necessário
        await pool.execute(
          'UPDATE usuarios SET nome = ?, email = ?, foto_url = ?, data_atualizacao = NOW() WHERE firebase_uid = ?',
          [firebaseUser.name, firebaseUser.email, firebaseUser.picture, firebaseUser.uid]
        );
        return existingUser[0];
      }

      // Criar novo usuário
      const [result] = await pool.execute(
        'INSERT INTO usuarios (firebase_uid, email, nome, foto_url) VALUES (?, ?, ?, ?)',
        [firebaseUser.uid, firebaseUser.email, firebaseUser.name, firebaseUser.picture]
      );

      const [newUser] = await pool.execute(
        'SELECT * FROM usuarios WHERE id = ?',
        [result.insertId]
      );

      return newUser[0];
    } catch (error) {
      throw new Error(`Erro ao processar usuário: ${error.message}`);
    }
  }

  async getUserByFirebaseUid(firebaseUid) {
    try {
      const [user] = await pool.execute(
        'SELECT * FROM usuarios WHERE firebase_uid = ? AND ativo = TRUE',
        [firebaseUid]
      );
      return user[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }
}

module.exports = new UserService();