import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsString, Length } from "class-validator";

@Exclude()
export class LoginBody {

    @Expose()
    // We can start adding validation decorators that specify exactly what we expect from the object we will be validating
    @IsEmail()
    public email: string;

    @Expose()
    @IsString()
    @Length(8)
    public password: string;
}