# 🚀 Solana Token Launchpad

A comprehensive decentralized application (dApp) for creating, managing, and trading SPL tokens on the Solana blockchain. This platform provides a seamless, no-code solution for launching tokens with full market creation and liquidity management capabilities.

![Token Launchpad](public/logo.svg)

## ✨ Features

### Core Functionality
- **🪙 SPL Token Creation**: Create custom tokens with metadata, images, and configurable parameters
- **🏪 Market Creation**: Automatically create OpenBook markets for your tokens
- **💧 Liquidity Management**: Add and remove liquidity with integrated Raydium pools
- **🔐 Authority Management**: Revoke mint and freeze authorities for decentralization
- **🔥 Token Burning**: Burn LP tokens and manage token supply
- **📊 Token Discovery**: Browse hot tokens and discover new projects

### User Experience
- **🔗 Wallet Integration**: Support for Phantom, Solflare, and other Solana wallets
- **📱 Responsive Design**: Mobile-first design with beautiful UI/UX
- **🌍 Multi-language Support**: Internationalization ready
- **📈 Real-time Data**: Live token prices and market data integration
- **💾 IPFS Storage**: Decentralized metadata and image storage via Pinata

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand
- **Blockchain**: Solana Web3.js, SPL Token, Metaplex
- **Wallet**: Solana Wallet Adapter
- **UI Components**: Material-UI (MUI)
- **Data Fetching**: React Query

### Backend
- **Runtime**: Node.js with Express
- **Storage**: IPFS via Pinata SDK
- **File Upload**: Multer for handling file uploads
- **CORS**: Cross-origin resource sharing enabled

### Blockchain Integration
- **Solana Web3.js**: Core blockchain interactions
- **SPL Token Program**: Token creation and management
- **Metaplex**: NFT and token metadata handling
- **Raydium SDK**: AMM liquidity pool integration
- **OpenBook**: Decentralized order book markets

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Solana CLI (optional, for advanced users)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/solana-token-launchpad.git
cd solana-token-launchpad
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
PINATA_JWT_KEY=your_pinata_jwt_key_here
```

4. **Start the development servers**

Frontend:
```bash
npm run dev
```

Backend:
```bash
npm run backend
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── create-token/       # Token creation flow
│   │   ├── my-token/          # User token management
│   │   ├── add-lp/            # Liquidity addition
│   │   ├── burn-lp/           # Liquidity burning
│   │   └── create-market/     # Market creation
│   ├── components/            # Reusable UI components
│   │   ├── LandingHeader/     # Navigation and wallet connection
│   │   ├── HotTokens/         # Trending tokens display
│   │   ├── DiscoverTokens/    # Token discovery
│   │   └── ...
│   ├── contexts/              # Blockchain interaction logic
│   │   ├── createSPLToken.tsx # Token creation
│   │   ├── createMarket.tsx   # Market creation
│   │   ├── createLiquidity.tsx# Liquidity management
│   │   └── ...
│   └── utils/                 # Utility functions and API calls
├── backend/                   # Express.js backend
│   ├── index.js              # Main server file
│   └── ...
├── public/                    # Static assets
└── ...
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
# For mainnet: https://api.mainnet-beta.solana.com
```

#### Backend (.env)
```env
PINATA_JWT_KEY=your_pinata_jwt_key
```

### Wallet Configuration
The app supports multiple Solana wallets:
- Phantom
- Solflare
- And other Solana-compatible wallets

## 📖 Usage Guide

### Creating a Token

1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Fill Token Details**:
   - Token Name (e.g., "My Token")
   - Symbol (e.g., "MTK")
   - Upload token logo image
   - Set decimals (typically 6-9)
   - Set initial supply
3. **Create Token**: Pay the creation fee (~0.62 SOL)
4. **Revoke Authorities**: Optionally revoke mint/freeze authorities for decentralization
5. **Create Market**: Set up trading pairs for your token
6. **Add Liquidity**: Provide initial liquidity for trading

### Managing Tokens

- **View Portfolio**: Check your created tokens in "My Tokens"
- **Add/Remove Liquidity**: Manage your LP positions
- **Burn Tokens**: Remove tokens from circulation
- **Track Performance**: Monitor token metrics and trading data

## 🔒 Security Features

- **Authority Revocation**: Remove mint and freeze authorities for true decentralization
- **Metadata Verification**: IPFS-based metadata storage for immutability
- **Wallet Security**: Integration with hardware wallets supported
- **Transaction Simulation**: Preview transactions before execution

## 🌐 API Integration

### Token Data
- **Birdeye API**: Real-time token prices and market data
- **Coingecko**: SOL price feeds
- **Custom Backend**: IPFS metadata management

### Endpoints
- `/connect-wallet`: Wallet connection management
- `/submit-action`: File upload and IPFS pinning
- `/submissions/:userWallet`: Retrieve user submissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Foundation** for the robust blockchain infrastructure
- **Metaplex** for NFT and token metadata standards
- **Raydium** for AMM integration
- **OpenBook** for decentralized order book functionality

## 📞 Support

- **Documentation**: Check the inline code comments and this README
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our Discord/Telegram for support

## 🔮 Roadmap

- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Advanced trading features
- [ ] DAO governance integration
- [ ] Mobile app development
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for the Solana ecosystem**