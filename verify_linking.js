import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from './src/models/Usuario.js';
import Vinculacion from './src/models/Vinculacion.js';

dotenv.config();

const verifyLinking = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // 1. Crear Usuario Adulto Mayor
        const codigo = 'TEST-' + Math.floor(Math.random() * 10000);
        const adultoMayor = new Usuario({
            nombre: "Abuelo Test",
            email: `abuelo_${Date.now()}@test.com`,
            password: "password123",
            rol: "adulto mayor",
            codigo_vinculacion: codigo
        });
        await adultoMayor.save();
        console.log(`👴 Adulto Mayor creado: ${adultoMayor.nombre} (Código: ${codigo})`);

        // 2. Crear Usuario Cuidador
        const cuidador = new Usuario({
            nombre: "Cuidador Test",
            email: `cuidador_${Date.now()}@test.com`,
            password: "password123",
            rol: "cuidador"
        });
        await cuidador.save();
        console.log(`🧑‍⚕️ Cuidador creado: ${cuidador.nombre}`);

        // 3. Simular Vinculación (Lógica del Controller)
        const vinculacion = new Vinculacion({
            cuidadorId: cuidador._id,
            pacienteId: adultoMayor._id, // Esto es lo que añadimos nuevo
            codigo_adulto_mayor: codigo,
            tipo_relacion: "familiar"
        });
        await vinculacion.save();
        console.log('🔗 Vinculación creada en DB');

        // 4. Verificar Population
        const vinculacionRecuperada = await Vinculacion.findById(vinculacion._id).populate('pacienteId');

        if (vinculacionRecuperada.pacienteId && vinculacionRecuperada.pacienteId.nombre === "Abuelo Test") {
            console.log('✅ VERIFICACIÓN EXITOSA: La vinculación contiene los datos del paciente correctamente.');
            console.log('   Datos recuperados:', vinculacionRecuperada.pacienteId.nombre, vinculacionRecuperada.pacienteId.email);
        } else {
            console.error('❌ ERROR: No se pudieron recuperar los datos del paciente desde la vinculación.');
        }

    } catch (error) {
        console.error('❌ Error en la verificación:', error);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Desconectado');
    }
};

verifyLinking();
