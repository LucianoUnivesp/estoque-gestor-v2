# 🍽️ Estoque Gestor - Sistema de Controle de Estoque para Restaurantes

Sistema web completo de gestão de estoque desenvolvido com Next.js (frontend) e NestJS (backend), integrado com Supabase. Especialmente projetado para otimizar o gerenciamento de insumos alimentícios em restaurantes, reduzir desperdícios e melhorar o planejamento de compras.

## 📖 Resumo do Projeto

Este documento apresenta o desenvolvimento de um software web destinado ao controle de estoque para restaurantes. O sistema visa otimizar o gerenciamento de insumos, reduzir desperdícios e melhorar o planejamento de compras. Os objetivos principais incluem a criação de uma interface intuitiva, implementação de funcionalidades para monitoramento preciso do estoque, geração de relatórios e integração com o processo de compras. O projeto utiliza tecnologias web modernas e práticas de desenvolvimento ágil para criar uma solução eficiente e adaptável às necessidades específicas do setor de restaurantes.

## 🚀 Funcionalidades Implementadas

- ✅ **Dashboard** - Visão geral com estatísticas e gráficos em tempo real
- ✅ **Gestão de Produtos** - CRUD completo de produtos com controle de preços (custo/venda)
- ✅ **Tipos de Produto** - Categorização de produtos por tipos
- ✅ **Movimentações de Estoque** - Controle de entrada (compras) e saída (vendas) com histórico
- ✅ **Relatórios e Gráficos** - Análise de tendências e movimentações
- ✅ **Alertas de Estoque Baixo** - Notificações automáticas
- ✅ **Interface Responsiva** - Compatível com desktop e mobile
- ✅ **Formatação Brasileira** - Valores em Real (R$) e datas no padrão brasileiro

## 🛠️ Tecnologias

### Frontend

- **Next.js 15** - Framework React
- **Material-UI** - Biblioteca de componentes
- **React Query** - Gerenciamento de estado servidor
- **Recharts** - Gráficos e visualizações
- **TypeScript** - Tipagem estática

### Backend

- **NestJS** - Framework Node.js
- **Supabase** - Banco de dados PostgreSQL
- **TypeScript** - Tipagem estática
- **Class Validator** - Validação de dados

## 📋 Pré-requisitos

- Node.js 18+
- Yarn 1.22+
- Conta no Supabase

## 🔧 Configuração

### 1. Clone o repositório

```bash
git clone <repository-url>
cd estoque-gestor
```

### 2. Instale as dependências

```bash
yarn install
```

### 3. Configure o Supabase

#### 3.1. Crie um projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e a chave anônima do projeto

#### 3.2. Execute o SQL para criar as tabelas

```sql
-- Criar tabela de tipos de produto
CREATE TABLE product_types (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de produtos
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  cost_price DECIMAL(10,2) NOT NULL CHECK (cost_price > 0),
  sale_price DECIMAL(10,2) NOT NULL CHECK (sale_price > 0),
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  expiration_date DATE,
  supplier VARCHAR(100),
  product_type_id BIGINT REFERENCES product_types(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de movimentações de estoque
CREATE TABLE stock_movements (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK (type IN ('entry', 'exit')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_products_product_type_id ON products(product_type_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_quantity ON products(quantity);
CREATE INDEX idx_products_expiration_date ON products(expiration_date);
CREATE INDEX idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX idx_stock_movements_type ON stock_movements(type);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_product_types_updated_at
    BEFORE UPDATE ON product_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 3.3. Inserir dados de exemplo para restaurante

Execute este script para popular o banco com dados de exemplo de insumos para restaurante:

```sql
-- Inserir tipos de produtos (categorias de insumos para restaurante)
INSERT INTO product_types (name, description) VALUES
('Proteínas', 'Carnes, peixes e proteínas em geral'),
('Vegetais', 'Verduras, legumes e hortaliças'),
('Laticínios', 'Leite, queijos e derivados'),
('Grãos e Cereais', 'Arroz, feijão, massas e farinhas'),
('Temperos e Condimentos', 'Especiarias, molhos e temperos'),
('Bebidas', 'Refrigerantes, sucos e águas'),
('Óleos e Gorduras', 'Óleos para cozinha e frituras'),
('Padaria', 'Pães e produtos de panificação'),
('Congelados', 'Produtos congelados diversos'),
('Enlatados', 'Conservas e produtos enlatados');

-- Inserir produtos de exemplo para restaurante
INSERT INTO products (name, description, cost_price, sale_price, quantity, supplier, product_type_id, expiration_date) VALUES
-- Proteínas
('Peito de Frango', 'Peito de frango sem osso por kg', 12.50, 25.00, 15, 'Avícola São João', 1, CURRENT_DATE + INTERVAL '5 days'),
('Carne Bovina (Alcatra)', 'Alcatra bovina por kg', 28.90, 55.00, 8, 'Frigorífico Premium', 1, CURRENT_DATE + INTERVAL '4 days'),
('Salmão', 'Salmão fresco por kg', 45.00, 85.00, 3, 'Peixaria Oceano', 1, CURRENT_DATE + INTERVAL '2 days'),
('Camarão Médio', 'Camarão médio limpo por kg', 38.90, 75.00, 2, 'Frutos do Mar Express', 1, CURRENT_DATE + INTERVAL '2 days'),

-- Vegetais
('Tomate', 'Tomate para molhos por kg', 4.50, 8.00, 12, 'Hortifruti Central', 2, CURRENT_DATE + INTERVAL '6 days'),
('Cebola', 'Cebola branca por kg', 3.20, 6.00, 20, 'Hortifruti Central', 2, CURRENT_DATE + INTERVAL '15 days'),
('Alho', 'Alho por kg', 18.50, 35.00, 5, 'Temperos & Cia', 2, CURRENT_DATE + INTERVAL '20 days'),
('Batata', 'Batata para pratos por kg', 2.90, 5.50, 25, 'Legumes & Verduras', 2, CURRENT_DATE + INTERVAL '12 days'),
('Cenoura', 'Cenoura por kg', 3.80, 7.00, 8, 'Hortifruti Central', 2, CURRENT_DATE + INTERVAL '10 days'),

-- Laticínios
('Queijo Mussarela', 'Queijo mussarela para pizzas por kg', 22.50, 40.00, 6, 'Laticínios Bela Vista', 3, CURRENT_DATE + INTERVAL '12 days'),
('Creme de Leite', 'Creme de leite 200ml', 3.20, 6.00, 15, 'Laticínios Bela Vista', 3, CURRENT_DATE + INTERVAL '15 days'),
('Manteiga', 'Manteiga sem sal 500g', 12.80, 22.00, 8, 'Laticínios Premium', 3, CURRENT_DATE + INTERVAL '25 days'),

-- Grãos e Cereais
('Arroz Agulhinha', 'Arroz tipo 1 para pratos - 5kg', 12.50, 20.00, 10, 'Cereais Brasil', 4, CURRENT_DATE + INTERVAL '180 days'),
('Macarrão Espaguete', 'Macarrão espaguete 500g', 2.20, 4.50, 20, 'Massas Italiana', 4, CURRENT_DATE + INTERVAL '90 days'),
('Farinha de Trigo', 'Farinha de trigo tipo 1 - 1kg', 3.50, 6.50, 12, 'Moinhos do Vale', 4, CURRENT_DATE + INTERVAL '120 days'),

-- Temperos e Condimentos
('Sal Refinado', 'Sal refinado 1kg', 1.80, 3.50, 15, 'Temperos & Cia', 5, CURRENT_DATE + INTERVAL '365 days'),
('Pimenta do Reino', 'Pimenta do reino moída 100g', 8.50, 15.00, 6, 'Especiarias Premium', 5, CURRENT_DATE + INTERVAL '180 days'),
('Orégano', 'Orégano desidratado 50g', 4.20, 8.00, 8, 'Especiarias Premium', 5, CURRENT_DATE + INTERVAL '150 days'),

-- Bebidas
('Coca-Cola 2L', 'Refrigerante Coca-Cola 2L', 4.20, 8.50, 24, 'Distribuidora RefriMax', 6, CURRENT_DATE + INTERVAL '90 days'),
('Água Mineral', 'Água mineral 500ml', 0.80, 2.00, 48, 'Águas Cristalinas', 6, CURRENT_DATE + INTERVAL '365 days'),
('Suco de Laranja', 'Suco natural de laranja 1L', 3.50, 7.50, 12, 'Sucos Naturais', 6, CURRENT_DATE + INTERVAL '5 days'),

-- Óleos
('Óleo de Soja', 'Óleo de soja para fritura 900ml', 3.90, 7.00, 10, 'Óleos Puros', 7, CURRENT_DATE + INTERVAL '120 days'),
('Azeite Extra Virgem', 'Azeite extra virgem 500ml', 18.50, 35.00, 4, 'Importados Premium', 7, CURRENT_DATE + INTERVAL '200 days'),

-- Enlatados
('Molho de Tomate', 'Molho de tomate tradicional 340g', 2.80, 5.50, 25, 'Conservas Bom Sabor', 10, CURRENT_DATE + INTERVAL '180 days'),
('Azeitona Verde', 'Azeitona verde sem caroço 200g', 4.50, 9.00, 12, 'Conservas Premium', 10, CURRENT_DATE + INTERVAL '365 days');

-- Inserir movimentações de exemplo
INSERT INTO stock_movements (type, quantity, product_id, notes, created_at) VALUES
-- Movimentações de hoje
('exit', 3, 1, 'Usado no prato do dia - Frango Grelhado', NOW()),
('exit', 2, 2, 'Preparo de Steak de Alcatra', NOW() - INTERVAL '2 hours'),
('exit', 5, 5, 'Molho para massas', NOW() - INTERVAL '1 hour'),
('entry', 10, 1, 'Reposição - Avícola São João', NOW() - INTERVAL '30 minutes'),

-- Movimentações de ontem
('exit', 4, 6, 'Base para refogados', NOW() - INTERVAL '1 day'),
('exit', 1, 3, 'Salmão grelhado do menu', NOW() - INTERVAL '1 day' + INTERVAL '2 hours'),
('entry', 15, 5, 'Compra semanal - Hortifruti Central', NOW() - INTERVAL '1 day' + INTERVAL '1 hour'),

-- Movimentações desta semana
('exit', 8, 11, 'Pizza Margherita - fim de semana', NOW() - INTERVAL '2 days'),
('exit', 6, 15, 'Pratos de massa da semana', NOW() - INTERVAL '2 days' + INTERVAL '4 hours'),
('entry', 20, 15, 'Compra mensal - Massas Italiana', NOW() - INTERVAL '3 days'),
('exit', 2, 4, 'Camarão na moranga', NOW() - INTERVAL '3 days' + INTERVAL '2 hours'),
('entry', 8, 11, 'Reposição - Laticínios Bela Vista', NOW() - INTERVAL '4 days');
```

### 4. Configure as variáveis de ambiente

#### Backend (.env)

```bash
cp backend/.env.example backend/.env
```

Edite o arquivo `backend/.env` e configure:

```
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
PORT=3001
NODE_ENV=development
```

#### Frontend (.env.local)

```bash
cp frontend/.env.example frontend/.env.local
```

Edite o arquivo `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
```

## 🚀 Executando o projeto

### Desenvolvimento (Frontend + Backend)

```bash
yarn start
# ou
yarn dev
```

### Executar apenas o backend

```bash
yarn start:backend
```

### Executar apenas o frontend

```bash
yarn start:frontend
```

### Build para produção

```bash
yarn build
```

## 📱 Acesso

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api

## 📁 Estrutura do Projeto

```
estoque-gestor/
├── frontend/                 # Aplicação Next.js
│   ├── src/
│   │   ├── app/             # Pages (App Router)
│   │   ├── components/      # Componentes React
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # Serviços de API
│   │   ├── interfaces/      # Tipos TypeScript
│   │   └── utils/           # Utilitários
│   └── package.json
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   ├── services/        # Serviços
│   │   ├── dtos/           # Data Transfer Objects
│   │   └── config/         # Configurações
│   └── package.json
└── package.json             # Configuração do monorepo
```

## 🔄 Fluxo de Dados

1. **Produtos**: Cadastro → Categorização → Controle de estoque
2. **Movimentações**: Entrada (compras) → Saída (consumo) → Atualização automática do estoque
3. **Dashboard**: Agregação de dados → Visualização em tempo real

## 🐛 Solução de Problemas

### Erro de conexão com Supabase

- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique se as tabelas foram criadas corretamente

### Erro de CORS

- Certifique-se de que o backend está rodando na porta 3001
- Verifique a configuração de CORS no arquivo `main.ts`

### Erro de compilação TypeScript

- Execute `yarn install` para garantir que todas as dependências estão instaladas
- Verifique se a versão do Node.js é 18+

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email: [seu-email@exemplo.com]

---

**Desenvolvido com ❤️ usando Next.js e NestJS**
