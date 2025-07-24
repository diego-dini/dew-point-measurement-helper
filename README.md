# Dew Point Measurement Helper

A React Native application for managing dew point measurements with dryer (dehumidifier) systems. This app helps track and control measurement processes, manage dryer configurations, and maintain measurement history.

## Features

- **Dryer Management**: Add, edit, and configure dryers with custom operational cycles
- **Measurement Control**: Start, monitor, and complete dew point measurements
- **Measurement History**: View and filter historical measurement data
- **Data Persistence**: Local storage using AsyncStorage for offline functionality
- **Intuitive UI**: Clean and responsive interface with real-time updates

## Technology Stack

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development with enhanced IDE support
- **Expo**: Development and deployment platform
- **AsyncStorage**: Local data persistence
- **Expo Notifications**: Background notifications for measurement alerts

## Project Structure

```
src/
├── App.tsx                 # Main application component
├── index.tsx              # Application entry point
├── __tests__/             # Test files
│   ├── integration.test.ts # Integration tests
│   └── utils/             # Utility tests
│       ├── storage.test.ts # Storage utility tests
│       └── time.test.ts   # Time utility tests
├── types/                 # TypeScript type definitions
│   ├── dryer.ts          # Dryer and cycle types
│   └── measurement.ts     # Measurement types and status enums
├── utils/                 # Utility functions
│   ├── storage.ts        # Data storage management
│   └── time.ts           # Time conversion utilities
├── contexts/              # React context providers
│   ├── DryerContext.tsx  # Dryer state management
│   ├── LoadingContext.tsx # Loading state management
│   ├── MeasurementContext.tsx # Measurement state management
│   ├── NotificationContext.tsx # Notification management
│   └── UpdateNextMeasurementContext.tsx # Next measurement timing
├── reducers/              # State reducers
│   ├── dryerReducer.ts   # Dryer state reducer
│   └── measurementReducer.ts # Measurement state reducer
├── elements/              # Reusable UI components
│   ├── Header.tsx        # Navigation header
│   ├── Loading.tsx       # Loading spinner
│   ├── Button.tsx        # Custom button component
│   ├── LabeledInput.tsx  # Input with label
│   ├── LabeledDisplay.tsx # Display with label
│   ├── Notification.tsx  # Notification overlay
│   ├── CardDisplay*.tsx  # Card components
│   └── ...              # Other UI components
└── screens/              # Main application screens
    ├── Dryers/          # Dryer management screen
    │   ├── index.tsx    # Main dryer screen
    │   ├── CycleContainer.tsx # Cycle management
    │   └── CycleEntry.tsx     # Individual cycle entry
    ├── Measurement/     # Measurement control screen
    │   ├── index.tsx    # Main measurement screen
    │   └── TowerDisplay.tsx   # Tower value display
    └── History/         # Historical data screen
        ├── index.tsx    # Main history screen
        └── MeasurementEntry.tsx # Individual measurement entry
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/diego-dini/dew-point-measurement-helper.git
cd dew-point-measurement-helper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
   - For Android: `npm run dev`
   - For production build: `npm run build`

### Development Commands

- `npm start` - Start Expo development server with tunnel
- `npm run dev` - Build development version for Android
- `npm run build` - Build production version for Android

## Usage

### Managing Dryers

1. Navigate to the "Desumidificador" (Dryer) tab
2. Add a new dryer by entering its name and ID
3. Configure operational cycles with names and durations
4. Save the configuration for use in measurements

### Taking Measurements

1. Go to the "Medição" (Measurement) tab
2. Select a configured dryer
3. Enter measurement values for left and right towers
4. Start the measurement process
5. Monitor progress and receive notifications

### Viewing History

1. Access the "Histórico" (History) tab
2. Filter measurements by date range or dryer
3. View detailed measurement information and status

## Data Models

### Dryer
```typescript
type Dryer = {
  id: number;
  name: string;
  cycles: DryerCycle[];
};

type DryerCycle = {
  name: string;
  duration: number; // Duration in milliseconds
};
```

### Measurement
```typescript
type Measurement = {
  id: number;
  date: number; // Timestamp in milliseconds
  dryer: number; // Dryer ID
  towers: { left: number; right: number };
  status: MeasurementStatus;
};

enum MeasurementStatus {
  ONGOING = "ongoing",
  COMPLETE = "complete",
  CANCELED = "canceled"
}
```

## Storage

The application uses AsyncStorage for data persistence with a singleton pattern for thread-safe operations:

- **Dryers**: Stored with key `"dryers"`
- **Measurement History**: Stored with key `"measurement-history"`
- **Current Measurement**: Stored with key `"current-measurement"`

## Time Utilities

The app includes utility functions for time conversion:
- `timestampToHHMMSS()` - Convert timestamp to HH:MM:SS format
- `timestampToDDMMYYYY()` - Convert timestamp to DD/MM/YYYY format
- `ddmmyyyyToTimestamp()` - Convert DD/MM/YYYY string to timestamp

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.