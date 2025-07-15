// google‑auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const from = (req.query.from as string) || undefined;

    return {
      // don’t use an Express session store
      session: false,

      // carry your “where to go next” in state
      state: from,

      // re‑declare your scopes
      scope: ['profile', 'email'],
    };
  }
}
