const { pool } = require('../config/database');

class VehicleService {
  async createVehicle(vehicleData, userId) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO veiculos (usuario_id, tipo, marca, modelo, ano, cor, placa, chassi, renavam, valor, observacoes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          vehicleData.tipo,
          vehicleData.marca,
          vehicleData.modelo,
          vehicleData.ano,
          vehicleData.cor,
          vehicleData.placa,
          vehicleData.chassi,
          vehicleData.renavam,
          vehicleData.valor,
          vehicleData.observacoes
        ]
      );

      return await this.getVehicleById(result.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Placa já cadastrada');
      }
      throw new Error(`Erro ao criar veículo: ${error.message}`);
    }
  }

  async getVehiclesByUser(userId) {
    try {
      const [vehicles] = await pool.execute(
        'SELECT * FROM veiculos WHERE usuario_id = ? AND ativo = TRUE ORDER BY data_criacao DESC',
        [userId]
      );
      return vehicles;
    } catch (error) {
      throw new Error(`Erro ao buscar veículos: ${error.message}`);
    }
  }

  async getVehicleById(vehicleId) {
    try {
      const [vehicle] = await pool.execute(
        'SELECT * FROM veiculos WHERE id = ? AND ativo = TRUE',
        [vehicleId]
      );
      return vehicle[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar veículo: ${error.message}`);
    }
  }

  async updateVehicle(vehicleId, vehicleData, userId) {
    try {
      const [result] = await pool.execute(
        `UPDATE veiculos SET tipo = ?, marca = ?, modelo = ?, ano = ?, cor = ?, 
         placa = ?, chassi = ?, renavam = ?, valor = ?, observacoes = ?, data_atualizacao = NOW()
         WHERE id = ? AND usuario_id = ? AND ativo = TRUE`,
        [
          vehicleData.tipo,
          vehicleData.marca,
          vehicleData.modelo,
          vehicleData.ano,
          vehicleData.cor,
          vehicleData.placa,
          vehicleData.chassi,
          vehicleData.renavam,
          vehicleData.valor,
          vehicleData.observacoes,
          vehicleId,
          userId
        ]
      );

      if (result.affectedRows === 0) {
        throw new Error('Veículo não encontrado ou não pertence ao usuário');
      }

      return await this.getVehicleById(vehicleId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Placa já cadastrada');
      }
      throw new Error(`Erro ao atualizar veículo: ${error.message}`);
    }
  }

  async deleteVehicle(vehicleId, userId) {
    try {
      const [result] = await pool.execute(
        'UPDATE veiculos SET ativo = FALSE WHERE id = ? AND usuario_id = ?',
        [vehicleId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Veículo não encontrado ou não pertence ao usuário');
      }

      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar veículo: ${error.message}`);
    }
  }

  async getVehicleStats(userId) {
    try {
      const [stats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_veiculos,
          COUNT(CASE WHEN tipo = 'carro' THEN 1 END) as total_carros,
          COUNT(CASE WHEN tipo = 'moto' THEN 1 END) as total_motos,
          COALESCE(SUM(valor), 0) as valor_total
         FROM veiculos 
         WHERE usuario_id = ? AND ativo = TRUE`,
        [userId]
      );
      return stats[0];
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }
  }
}

module.exports = new VehicleService();