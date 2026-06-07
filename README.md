# PreQ Frontend

![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)
[![codecov](https://codecov.io/github/PreQ-G10/preq-frontend/branch/main/graph/badge.svg?token=LLT6CE7RCZ)](https://codecov.io/github/PreQ-G10/preq-frontend)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

Aplicación mobile frontend de **PreQ**, desarrollada con **Expo**, **React Native** y **TypeScript**.

PreQ ayuda a los usuarios a identificar productos, gestionar carritos y comparar precios.

---

## Funcionalidades

- Autenticación de usuarios
- Escaneo de códigos de barras
- Detección de imagenes
- Comparación de precios
- Geolocalización automática

---

## Stack Tecnológico

- **Expo**
- **React Native**
- **Expo Router**
- **TypeScript**
- **React Navigation**
- **React Native Maps**
- **Expo Location**

---

## Estructura del Proyecto

```txt
app/            # Rutas y pantallas
components/     # Componentes reutilizables
constants/      # Tema y constantes
context/        # Estado global / contextos
services/       # Comunicación con APIs
types/          # Tipados compartidos
utils/          # Utilidades/helpers
```

## Primeros Pasos

### Requisitos

- Node.js
- npm
- Xcode (iOS)
- Android Studio (Android)
- Expo CLI

### Instalación

Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd preq-frontend
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env`:

```env
EXPO_PUBLIC_API_URL=backend_api
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
```

Ejecutar el proyecto:

```bash
npm start
```

Ejecutar en iOS:

```bash
npm run ios
```

Ejecutar en Android:

```bash
npm run android
```

---

## Licencia

Este proyecto se encuentra bajo la licencia MIT.