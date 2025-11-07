
const ExcelJS = require('exceljs');

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { datos } = body;

        // Validación de datos
        if (!datos || !Array.isArray(datos) || datos.length === 0) {
            throw new Error("Datos inválidos: debe ser un array no vacío de ciudades.");
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Ciudades"); // Hoja Ciudades

        // --- LÓGICA DINÁMICA ---
        // Extraer encabezados del primer item
        const headers = Object.keys(datos[0]);
        worksheet.addRow(headers);

        // Agregar filas con los datos
        datos.forEach((item) => {
            // Mapea los valores en el orden de los encabezados
            const row = headers.map(header => item[header] || ""); // Maneja nulos
            worksheet.addRow(row);
        });

        // Auto-ajustar columnas
        worksheet.columns = headers.map(header => ({
            width: Math.max(10, header.length + 2)
        }));
        // --- FIN LÓGICA DINÁMICA ---

        // Generar archivo
        const buffer = await workbook.xlsx.writeBuffer();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": "attachment; filename=reporte_ciudades.xlsx", // Nombre de archivo actualizado
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            isBase64Encoded: true,
            body: buffer.toString('base64')
        };

    } catch (error) {
        console.error("Error en Lambda:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                mensaje: "Error generando Excel",
                error: error.message
            })
        };
    }
};