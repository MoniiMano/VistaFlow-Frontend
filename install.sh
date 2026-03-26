#!/bin/bash

# VistaFlow Installation Script
# This script automates the setup process

echo "🚀 VistaFlow Installation Script"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "📦 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm $(npm -v) detected${NC}"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠ MongoDB is not detected${NC}"
    echo "You can:"
    echo "  1. Install MongoDB locally from https://www.mongodb.com/try/download/community"
    echo "  2. Use MongoDB Atlas (cloud) - we'll configure this later"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ MongoDB detected${NC}"
fi

echo ""
echo "📥 Installing dependencies..."
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend installation failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend installation failed${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo ""
echo "⚙️  Setting up environment files..."
echo ""

# Setup frontend .env
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Frontend .env created${NC}"
else
    echo -e "${YELLOW}⚠ Frontend .env already exists, skipping${NC}"
fi

# Setup backend .env
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Backend .env created${NC}"
else
    echo -e "${YELLOW}⚠ Backend .env already exists, skipping${NC}"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Start MongoDB:"
echo "   ${YELLOW}mongod${NC}"
echo ""
echo "2. Start the backend (in a new terminal):"
echo "   ${YELLOW}cd backend && npm run dev${NC}"
echo ""
echo "3. Start the frontend (in another terminal):"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "4. Open your browser:"
echo "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - QUICK_START.md"
echo "   - SETUP_GUIDE.md"
echo ""
echo "🎉 Happy coding!"
