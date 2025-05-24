# Estoque Gestor

Sistema completo de gestão de estoque desenvolvido com Next.js (frontend) e NestJS (backend), integrado com Supabase.

## 🚀 Funcionalidades

- ✅ **Dashboard** - Visão geral com estatísticas e gráficos em tempo real
- ✅ **Gestão de Produtos** - CRUD completo de produtos
- ✅ **Tipos de Produto** - Categorização de produtos
- ✅ **Movimentações de Estoque** - Controle de entrada e saída com histórico
- ✅ **Relatórios e Gráficos** - Análise de tendências e movimentações
- ✅ **Alertas de Estoque Baixo** - Notificações automáticas
- ✅ **Interface Responsiva** - Compatível com desktop e mobile

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
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de produtos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    expiration_date DATE,
    supplier VARCHAR(100),
    product_type_id INTEGER REFERENCES product_types(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de movimentações de estoque
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('entry', 'exit')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    product_id INTEGER NOT NULL REFERENCES products(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_products_product_type ON products(product_type_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX idx_products_quantity ON products(quantity);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_types_updated_at 
    BEFORE UPDATE ON product_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
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
2. **Movimentações**: Entrada/Saída → Atualização automática do estoque
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

## 📝 Próximas Funcionalidades

- [ ] Autenticação e autorização
- [ ] Relatórios avançados (PDF/Excel)
- [ ] Notificações push
- [ ] Integração com código de barras
- [ ] Multi-filiais
- [ ] Backup automático

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