# Kirby's Budget App

A personal budgeting application built with React + TypeScript for learning SonarQube code quality analysis. The app helps users track income, expenses, and provides budget recommendations based on financial best practices.

## Features

### Core Functionality
- **Income Management**: Add, edit, and track multiple income sources with different frequencies
- **Expense Tracking**: Categorized expense tracking with recurring expense support
- **Budget Analysis**: 50/30/20 rule implementation with custom recommendations
- **Visual Analytics**: Interactive charts and financial health dashboard
- **Data Persistence**: Local storage with CSV export/import functionality

### Technical Features
- **React 18** with TypeScript for type safety
- **Recharts** for data visualization
- **Lucide React** for modern icons
- **Date-fns** for date manipulation
- **ESLint** with SonarJS rules for code quality
- **Jest** + React Testing Library for comprehensive testing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/martin-larocca-sonarsource/kirbys-app.git
cd kirbys-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## SonarQube Integration

This project is specifically designed for learning SonarQube code quality analysis with:

- **Code Smells**: Duplicate code detection, long methods, complex conditionals
- **Security Issues**: XSS prevention, input sanitization
- **Bugs**: Null pointer exceptions, type mismatches
- **Vulnerabilities**: Dependency vulnerabilities, unsafe operations
- **Maintainability**: Code duplication analysis, cognitive complexity
- **Reliability**: Error handling, edge cases
- **Test Coverage**: Unit test coverage analysis

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx
│   ├── IncomeManagement.tsx
│   ├── ExpenseTracking.tsx
│   ├── BudgetAnalysis.tsx
│   └── Navigation.tsx
├── types/              # TypeScript interfaces
├── utils/              # Utility functions
├── styles/             # CSS modules
└── App.tsx            # Main application
```

## Design System

- **Typography**: Inter (sans-serif) + EB Garamond (serif)
- **Color Palette**: Light parchment theme with warm browns and greens
- **Layout**: Minimalist design with clean spacing and subtle shadows
- **Responsive**: Mobile-first design with desktop enhancements

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for SonarQube learning and code quality analysis
- Inspired by the 50/30/20 budgeting rule
- Designed with accessibility and user experience in mind
