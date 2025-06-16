const userService = require('../services/userService');

class UserController {
  async getProfile(req, res) {
    try {
      console.log("[GET] /api/users/profile chamado");

      const user = await userService.findOrCreateUser(req.user);

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          nome: user.nome,
          foto_url: user.foto_url,
          data_criacao: user.data_criacao
        }
      });
    } catch (error) {
      console.error("❌ Erro em getProfile:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateProfile(req, res) {
    try {
      console.log("[PUT] /api/users/profile chamado");
      const { nome } = req.body;
      
      if (!nome) {
        return res.status(400).json({
          success: false,
          error: 'Nome é obrigatório'
        });
      }

      const user = await userService.findOrCreateUser({
        ...req.user,
        name: nome
      });

      res.json({
        success: true,
        data: user,
        message: 'Perfil atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new UserController();