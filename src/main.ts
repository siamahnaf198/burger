import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//Validation pipe
import { ValidationError, BadRequestException, ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors: ValidationError[]) => {
      const error_messages = errors.map(error => {
        return Object.values(error.constraints)[0]
      });
      return new BadRequestException(error_messages.toString());
    },
    forbidUnknownValues: false,
  }))
  await app.listen(process.env.APPLICATION_PORT || 5000);
}
bootstrap();
