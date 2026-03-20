/** Especificación OpenAPI 3 — solo rutas del módulo Users (/api/users). */

export default {
    openapi: '3.0.0',
    info: {
        title: 'AdoptMe API — Users',
        version: '1.0.0',
        description:
            'Documentación Swagger del router de usuarios: listado, detalle, actualización, borrado y carga de documentos.'
    },
    servers: [{ url: '/', description: 'Origen del servidor' }],
    tags: [{ name: 'Users', description: 'Operaciones sobre usuarios' }],
    paths: {
        '/api/users': {
            get: {
                tags: ['Users'],
                summary: 'Obtener todos los usuarios',
                operationId: 'getAllUsers',
                responses: {
                    200: {
                        description: 'Lista de usuarios',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UsersListResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/users/{uid}': {
            get: {
                tags: ['Users'],
                summary: 'Obtener un usuario por ID',
                operationId: 'getUserById',
                parameters: [{ $ref: '#/components/parameters/uid' }],
                responses: {
                    200: {
                        description: 'Usuario encontrado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UserSuccessResponse' }
                            }
                        }
                    },
                    404: { $ref: '#/components/responses/NotFound' }
                }
            },
            put: {
                tags: ['Users'],
                summary: 'Actualizar usuario',
                operationId: 'updateUser',
                parameters: [{ $ref: '#/components/parameters/uid' }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UserUpdateBody' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Usuario actualizado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MessageSuccess' }
                            }
                        }
                    },
                    404: { $ref: '#/components/responses/NotFound' }
                }
            },
            delete: {
                tags: ['Users'],
                summary: 'Eliminar usuario (lógica según implementación del controlador)',
                operationId: 'deleteUser',
                parameters: [{ $ref: '#/components/parameters/uid' }],
                responses: {
                    200: {
                        description: 'Respuesta de borrado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MessageSuccess' }
                            }
                        }
                    }
                }
            }
        },
        '/api/users/{uid}/documents': {
            post: {
                tags: ['Users'],
                summary: 'Subir uno o varios documentos del usuario',
                description:
                    'Multipart: campo de archivos `documents` (hasta 25). Se agregan entradas `{ name, reference }` al arreglo `documents` del usuario.',
                operationId: 'uploadUserDocuments',
                parameters: [{ $ref: '#/components/parameters/uid' }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                required: ['documents'],
                                properties: {
                                    documents: {
                                        type: 'array',
                                        items: { type: 'string', format: 'binary' }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Usuario con documentos actualizados',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UserDocumentsSuccessResponse' }
                            }
                        }
                    },
                    400: {
                        description: 'Sin archivos o petición inválida',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    },
                    404: { $ref: '#/components/responses/NotFound' }
                }
            }
        }
    },
    components: {
        parameters: {
            uid: {
                name: 'uid',
                in: 'path',
                required: true,
                description: 'ID MongoDB del usuario',
                schema: { type: 'string', example: '507f1f77bcf86cd799439011' }
            }
        },
        responses: {
            NotFound: {
                description: 'Recurso no encontrado',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' }
                    }
                }
            }
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'error' },
                    error: { type: 'string' }
                }
            },
            MessageSuccess: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'success' },
                    message: { type: 'string' }
                }
            },
            UserDocument: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    reference: { type: 'string' }
                }
            },
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    first_name: { type: 'string' },
                    last_name: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                    pets: { type: 'array', items: { type: 'object' } },
                    documents: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/UserDocument' }
                    },
                    last_connection: { type: 'string', format: 'date-time', nullable: true }
                }
            },
            UserUpdateBody: {
                type: 'object',
                description: 'Campos a actualizar (parcial)',
                properties: {
                    first_name: { type: 'string' },
                    last_name: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string' }
                }
            },
            UsersListResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'success' },
                    payload: { type: 'array', items: { $ref: '#/components/schemas/User' } }
                }
            },
            UserSuccessResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'success' },
                    payload: { $ref: '#/components/schemas/User' }
                }
            },
            UserDocumentsSuccessResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'success' },
                    payload: { $ref: '#/components/schemas/User' }
                }
            }
        }
    }
};
