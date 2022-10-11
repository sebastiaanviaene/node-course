import { Body, Representer } from "@panenco/papi";
import { JsonController, Post } from "routing-controllers";
import { AccessTokenView } from "../../contracts/accessToken.view";
import { LoginBody } from "../../contracts/login.body";
import { createToken } from "./handlers/auth.login.handler";


@JsonController('/auth')
export class AuthController {

    @Post('/tokens')
    @Representer(AccessTokenView)
    async login(
      @Body() body: LoginBody
    ){
      const token = await createToken(body);
      return token;
    }
}