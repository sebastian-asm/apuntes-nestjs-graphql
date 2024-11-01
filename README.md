# Apuntes de NestJS + GraphQL

## Repaso

- **Controller**: donde se escuchan las peticiones
- **Service**: maneja la lógica de negocio
- **Module**: agrupador
- **Entity**: es una representación de como luce una entrada en la base de datos
- **DTO (Data Transfer Object)**: es utilizado para asegurarse que la información del `body` sea la esperada

## GraphQL

Es un lenguaje para leer y mutar data mediante APIs (Query language). Permite devolver al frontend solo la información que necesita o es requerida y así reducir el uso de ancho de banda.

- **Schema First (Schema Definition Language - SDL)**: quiere decir que comenzamos a trabajar y crear los tipos/esquemas de la manera tradicional.
- **Code First**: las clases y definiciones se crear desde Typescript, el cual crea automáticamente el SDL por nosotros.

![Graphql](assets/image.png)

- **Resolvers**: contienen las instrucciones para transformar las peticiones del cliente en datos que GraphQL pueda utilizar. Son similares a un Controller pero técnicamente son `providers`.
- **Arguments**: información adicional que se puede enviar en las queries.
