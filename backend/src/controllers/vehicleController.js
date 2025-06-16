const vehicleService = require('../services/vehicleService');
const userService = require('../services/userService');

class VehicleController {
  async createVehicle(req, res) {
    try {
      console.log("[POST] /api/vehicles chamado");

      const {
        tipo,
        marca,
        modelo,
        ano,
        cor,
        placa,
        chassi,
        renavam,
        valor,
        observacoes,
      } = req.body;

      if (!tipo || !marca || !modelo || !ano || !placa) {
        console.warn("⚠️ Falha na validação: campos obrigatórios ausentes.");
        return res.status(400).json({
          success: false,
          error: 'Campos obrigatórios: tipo, marca, modelo, ano, placa'
        });
      }

      if (!['carro', 'moto'].includes(tipo.toLowerCase())) {
        console.warn("⚠️ Tipo inválido recebido:", tipo);
        return res.status(400).json({
          success: false,
          error: 'Tipo deve ser "carro" ou "moto"'
        });
      }

      const user = await userService.getUserByFirebaseUid(req.user.uid);
      if (!user) {
        console.warn("⚠️ Usuário não encontrado para UID:", req.user.uid);
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      const vehicleData = {
        tipo,
        marca,
        modelo,
        ano,
        cor,
        placa,
        chassi: chassi ?? null,
        renavam: renavam ?? null,
        valor: valor ?? null,
        observacoes: observacoes ?? null
      };

      const vehicle = await vehicleService.createVehicle(vehicleData, user.id);

      res.status(201).json({
        success: true,
        data: vehicle,
        message: 'Veículo cadastrado com sucesso'
      });

    } catch (error) {
      console.error("❌ Erro ao criar veículo:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getVehicles(req, res) {
    try {
      console.log("[GET] /api/vehicles chamado");
      const user = await userService.getUserByFirebaseUid(req.user.uid);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      const vehicles = await vehicleService.getVehiclesByUser(user.id);
      const stats = await vehicleService.getVehicleStats(user.id);

      res.json({
        success: true,
        data: {
          vehicles,
          stats
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getVehicleById(req, res) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.getVehicleById(id);

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Veículo não encontrado'
        });
      }

      // Verificar se o veículo pertence ao usuário
      const user = await userService.getUserByFirebaseUid(req.user.uid);
      if (vehicle.usuario_id !== user.id) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado'
        });
      }

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateVehicle(req, res) {
    try {
      const { id } = req.params;
      const { tipo, marca, modelo, ano, cor, placa, chassi, renavam, valor, observacoes } = req.body;


      if (!tipo || !marca || !modelo || !ano || !placa) {
        return res.status(400).json({
          success: false,
          error: 'Campos obrigatórios: tipo, marca, modelo, ano, placa'
        });
      }

      const user = await userService.getUserByFirebaseUid(req.user.uid);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      const vehicleData = {
        tipo: tipo ?? null,
        marca: marca ?? null,
        modelo: modelo ?? null,
        ano: ano ?? null,
        cor: cor ?? null,
        placa: placa ?? null,
        chassi: chassi ?? null,
        renavam: renavam ?? null,
        valor: valor ?? null,
        observacoes: observacoes ?? null
      };

      const vehicle = await vehicleService.updateVehicle(id, vehicleData, user.id);

      res.json({
        success: true,
        data: vehicle,
        message: 'Veículo atualizado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteVehicle(req, res) {
    try {
      const { id } = req.params;

      const user = await userService.getUserByFirebaseUid(req.user.uid);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      await vehicleService.deleteVehicle(id, user.id);

      res.json({
        success: true,
        message: 'Veículo removido com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new VehicleController();