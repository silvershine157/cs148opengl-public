#pragma once

#ifndef __DIRECTIONAL_LIGHT__
#define __DIRECTIONAL_LIGHT__

#include "common/Scene/SceneObject.h"
#include "common/Scene/Light/Light.h"

class DirectionalLight: public Light
{
public:
    DirectionalLight(std::unique_ptr<struct LightProperties> inProperties, glm::vec3 direction, LightType type = LightType::DIRECTIONAL);
    virtual ~DirectionalLight();

	void DirectionalLight::SetupShaderUniforms(const ShaderProgram* program) const;

private:
    static const std::string LIGHT_UNIFORM_NAME;
    std::unique_ptr<struct LightProperties> properties;

    LightType lightType;

    glm::vec3 direction;

    // Attenuation
    float constantAttenuation;
    float linearAttenuation;
    float quadraticAttenuation;
};

#endif
