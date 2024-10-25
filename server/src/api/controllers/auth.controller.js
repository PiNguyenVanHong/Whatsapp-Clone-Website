import bcrypt from "bcrypt";
import { generateToken04 } from "../helpers/generate-token.js";
import { addUser, getUserByEmail } from "../services/user.service.js";
import { generateTokenJwt } from "../helpers/jwt.helper.js";

export const checkUser = async (req, res, next) => {
    try {
        const  { email } =  req.body; 

        if(!email) {
            return res.json({ message: "Email is required!!!", status: false });
        }

        const user = await getUserByEmail({ email });

        if(!user) {
            return res.json({ message: "User not found!!!", status: false });
        }

        return res.json({ user, status: true });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "Invalid Creadentials" });
        }

        const user = await getUserByEmail({ email });

        if(!user) {
            return res.status(404).json({ message: "Your email is not exist!"});
        }      

        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

        if(!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const { tokenData, signature, age, infoUser } = await generateTokenJwt({ userId: user.id, user });

        res.cookie("signature", signature, {
            httpOnly: true,
            maxAge: age,
        }).status(200).json({ tokenData, infoUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
    }
}

export const register = async (req, res, next) => {
    try {
        const { email, first_name, last_name, bio, avatar, password } = req.body;

    if(!email || !first_name || !last_name || avatar | password) {
        return res.status(400).json({ message: "Invalid Creadentials" });
    }

    const existUser = await getUserByEmail({ email });

    if(existUser) {
        return res.status(409).json({ message: "Email already exists"});
    }

    await addUser({ email, first_name, last_name, bio, avatar, password });

    return res.status(200).json({ message: "Register successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
    }
}

export const onBoardUser = async (req, res, next) => {
    try {
        const { email, first_name, last_name, bio, avatar, password } = req.body;
        if(!email) {
            return res.status(400).json({ message: "Email is required!" });
        }
        if(!first_name) {
            return res.status(400).json({ message: "First Name is required!" });
        }
        if(!last_name) {
            return res.status(400).json({ message: "Last Name is required!" });
        }
        if(!avatar) {
            return res.status(400).json({ message: "Image is required!" });
        }

        const user = await addUser({ email, first_name, last_name, bio, avatar, password });;

        const { tokenData, signature, age, infoUser } = await generateTokenJwt({ userId: user.id, user });

        return res.cookie("signature", signature, {
            httpOnly: true,
            maxAge: age,
        }).status(200).json({ tokenData, infoUser, message: "Create profile successfull!!!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
    }
};

export const generateToken = async (req, res, next) => {
    try {
        const appId = parseInt(process.env.ZEGO_APP_ID);
        const secret = process.env.ZEGO_APP_SERVER_SECRET;
        const { userId } = req.params;
        const effectiveTime = 3600;
        const payload = "";

        if(!appId || !secret) {
            return res.status(500).json({ message: "Something went wrong with your server" });
        }

        if(!userId) {
            return res.status(400).json({ message: "UserId is required!!!" });
        }

        const token = generateToken04(appId, userId, secret, effectiveTime, payload);

        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
    }
};