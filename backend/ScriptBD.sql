-- Database: cadastro_veiculos

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS cadastro_veiculos;
USE cadastro_veiculos;

-- Tabela de usuários (sincronizada com Firebase)
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    foto_url VARCHAR(500),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de veículos
CREATE TABLE veiculos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo ENUM('carro', 'moto') NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano INT NOT NULL,
    cor VARCHAR(50),
    placa VARCHAR(10) UNIQUE NOT NULL,
    chassi VARCHAR(17),
    renavam VARCHAR(20),
    valor DECIMAL(10,2),
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    
    -- Chave estrangeira
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Índices para otimização
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_tipo (tipo),
    INDEX idx_placa (placa),
    INDEX idx_ativo (ativo)
);

-- View para listar veículos com informações do usuário
CREATE VIEW vw_veiculos_usuarios AS
SELECT 
    v.id,
    v.tipo,
    v.marca,
    v.modelo,
    v.ano,
    v.cor,
    v.placa,
    v.valor,
    v.observacoes,
    v.data_criacao,
    u.nome as usuario_nome,
    u.email as usuario_email,
    u.firebase_uid
FROM veiculos v
INNER JOIN usuarios u ON v.usuario_id = u.id
WHERE v.ativo = TRUE AND u.ativo = TRUE;

-- View para estatísticas por usuário
CREATE VIEW vw_estatisticas_usuario AS
SELECT 
    u.id as usuario_id,
    u.nome,
    u.email,
    COUNT(v.id) as total_veiculos,
    COUNT(CASE WHEN v.tipo = 'carro' THEN 1 END) as total_carros,
    COUNT(CASE WHEN v.tipo = 'moto' THEN 1 END) as total_motos,
    COALESCE(SUM(v.valor), 0) as valor_total_veiculos
FROM usuarios u
LEFT JOIN veiculos v ON u.id = v.usuario_id AND v.ativo = TRUE
WHERE u.ativo = TRUE
GROUP BY u.id, u.nome, u.email;