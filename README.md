# Angular Voting DApp on Truffle Framework.

## Setup

- install metamask in browser

- npm install -g truffle
- npm install -g @angular/cli
- npm install
- truffle compile
- truffle migrate --reset

- cd web
- npm install
- ng serve

## Deployment

1. Ganache:

![Levantar Ganache](./README_PICS/ganache_readme_1.png)

2. Tomar de Ganache un address e ingresarlo en el constructor del contrato Election.sol, ubicado en /contracts:
  adminsRegister[address(** address **)] = true;

  ![Ingresar address a votantes permitidos](./README_PICS/contract_readme_2.png)

3. Ejecutar los comandos:
  - truffle compile
  - truffle migrate --reset

4. Moverse a la carpeta /web, y levantar localmente la web app
  - cd web
  - ng serve

5. Dirigirse a http://localhost:4200 y en metamask, iniciar sesión en localhost:8545

  ![Iniciar sesión en metamask](./README_PICS/readme_3.png)

6. Importar una cuenta a metamask

  ![Importar cuenta a traves de private key obtenido de ganache](./README_PICS/readme_4.png)

  ![](./README_PICS/readme_5.png)

7. Refrescar y conectar la acuenta ingresada. Refrescar nuevamente.

  ![](./README_PICS/readme_6.png)

7. Si su address es uno habilitado para votar, podrá hacerlo, de lo contrario será rechazado.

  ![Voto habilitado](./README_PICS/readme_9.png)

  ![Voto NO habilitado](./README_PICS/readme_7.png)



