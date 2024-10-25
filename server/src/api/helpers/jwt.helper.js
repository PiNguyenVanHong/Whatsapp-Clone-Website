import jwt from "jsonwebtoken";

export async function generateTokenJwt({ userId, user }) {
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = await jwt.sign({
        sub: userId,
    }, 
        process.env.JWT_SERCET_KEY,
        { expiresIn: age },
    );

    const { hashedPassword, updatedAt, createdAt, ...infoUser } = user;

    const [ headers, payload, signature ] = token.split(".");
    const tokenData = `${headers}.${payload}`;

    return { tokenData, signature, age, infoUser };
};