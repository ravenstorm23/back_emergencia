import User from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===== Registro =====
export const registerUser = async (req, res) => {
  const { nombre, email, password, telefono, direccion, rol } = req.body;
  try {
    // Validación básica
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ msg: "Todos los campos obligatorios deben completarse" });
    }

    if (!["cuidador", "adulto mayor"].includes(rol.trim().toLowerCase())) {
      return res.status(400).json({ msg: "El rol debe ser 'cuidador' o 'adulto mayor'" });
    }

    // Verificar si ya existe usuario
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const user = new User({
      nombre,
      email,
      password: hashedPassword,
      telefono,
      direccion,
      rol,
    });

    await user.save();

    // Generar token JWT
    const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      msg: "Usuario registrado correctamente",
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
      token,
    });
  } catch (error) {
    console.error(" Error en /register:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// ===== Login =====
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "Todos los campos obligatorios deben completarse" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Credenciales incorrectas" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Credenciales incorrectas" });

    const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      msg: "Login exitoso",
      user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol },
      token,
    });
  } catch (error) {
    console.error(" Error en /login:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
