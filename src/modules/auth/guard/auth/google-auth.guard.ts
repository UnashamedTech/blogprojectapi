// google-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const from = (req.query.from as string) || undefined;
    return {
      // tell passport to include your “from” value in the OAuth state
      state: from,
      scope: ['profile','email'],
    };
  }
}
