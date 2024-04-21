# UC3Shop - Práctica Final
Una aplicación para utlizar tu móvil como método para gestionar tus compras en grandes superficies.



## Usage
Clonar el repositorio [`https://github.com/victorvalchez/UC3Shop/`](https://github.com/victorvalchez/UC3Shop/) en tu entorno de desarrollo preferido.

Abrir la carpeta del proyecto 
```
cd UC3Shop
```

Instalar todas las dependencias con
```
npm install
```

Ejecutar el siguiente comando para iniciar la aplicación
```
nodemon app
```

Dirigirse a [`http://localhost:3000`](http://localhost:3000) y conectar nuestro dispositivo móvil habiendo activado previamente la depuración USB


## Funciones extra
1. Posibilidad de llamar al empleado en cualquier momento mediante la triple pulsación de la pantalla. El empleado recibirá un aviso en su web de que el cliente necesita ayuda.
2. Simulación final de pago. Se intentó reconocer tarjetas de crédito mediante NFC pero por temás de seguridad esta funcionalidad se ha sustituido por una simulación del gesto de pagar _contactless_.
3. No es una función extra como tal, pero se añade la posibilidad de ordenar los productos en la lista de favoritos al igual que se requiere en el carrito.


## FAQ

### Página Principal
1. #### ¿Desde la página principal, cómo uso la app?
      1. Si eres empleado, introduce tu código de acceso (1234)
      2. Si eres cliente, pulsa el botón

### Página de Cliente
1. #### ¿Desde la página del cliente, cómo accedo al carrito?
      Gira tu móvil a la derecha sobre el eje vertical

2. #### ¿Desde la página del cliente, cómo accedo a favoritos?
     Gira tu móvil a la izquierda sobre el eje vertical

3. #### ¿Desde la página del cliente, cómo escaneo un artículo?
      Agita tu móvil y se abrirá la cámara. Se puede usar escaneando la etiqueta en `./tags/ipad.png`

4. #### ¿Desde la página del cliente, cómo salgo del escáner?
      Toca la pantalla fuera del recuadro del vídeo

5. #### ¿Desde la página del cliente, cómo llamo a un empleado?
      Toca la pantalla *tres* veces seguidas y se notificará al empleado


### Página de Favoritos
1. #### ¿Desde la página de favoritos, cómo quito un artículo de favoritos?
     Da doble tap sobre la imagen del artículo (estará rodeada por un recuadro rosado)

2. #### ¿Desde la página de favoritos, cómo vuelvo a la página principal?
      Gira tu móvil a la derecha sobre el eje vertical


### Página del Carrito
1. #### ¿Desde la página del carrito, cómo añado/quito un artículo de favoritos?
      Da doble tap sobre la imagen del artículo (se rodeará por un recuadro rosado si está en favoritos)

2. #### ¿Desde la página del carrito, cómo quito/reduzco la cantidad de un artículo de mi carrito?
      Mantén pulsada la imagen durante *un* segundo y el dispositivo vibrará para confirmar. Verás la cantidad actualizada o la desaparición del artículo

3. #### ¿Desde la página del carrito, cómo vuelvo a la página principal?
      Gira tu móvil a la izquierda sobre el eje vertical

4. #### ¿Desde la página del carrito, cómo accedo al proceso de pago?
      Dí en alto la frase *"Finalizar compra."* y te llevará al proceso de pago.

### Página de Empleado
1. #### ¿Desde la página de empleado, cómo accedo a los productos del cliente?
      Cuando el cliente pase al proceso de pago, verás sus artículos en tu pantalla actualizados 

2. #### #### ¿Desde la página de empleado, cómo finalizo la compra?
      Pulsa el botón de *"Cerrar Caja"* y se limpiará el carrito del cliente automáticmanete

### Página de Pago
1. #### ¿Desde la página de pago, cómo realizo la transacción?
      Baja tu móvil como si fueses a pagar por contactless. El dispositivo te notificará si ha sido exitoso.

2. #### ¿Desde la página de pago, cómo vuelvo a la página principal?
      Toca la pantalla tres veces seguidas


## Authors

🚀 [victorvalchez](https://www.github.com/victorvalchez) 100451210@alumnos.uc3m -- Víctor Valencia Sánchez
🌈 [3lenaaa](https://github.com/3lenaaa) 100451238@alumnos.uc3m -- Elena Esther Pajares Palomo


![Logo](https://lh5.googleusercontent.com/proxy/2WBXjzZ89vUiq3ofu605eGbASyzwnIDOh080DXw1K8C_JXjd591B9Xuwz16es3JF2dVAPg3USQ1z7h_oJQTnztdMdGhzGDaJxPg77mjlQ1QtCRkkCLvZfUCGbxLHCQfZJoOTx1j2OPcQ)

