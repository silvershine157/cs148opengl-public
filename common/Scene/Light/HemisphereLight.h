#pragma once

#ifndef __HEMISPHERE_LIGHT__
#define __HEMISPHERE_LIGHT__

#include "common/Scene/SceneObject.h"
#include "common/Scene/Light/Light.h"

class HemisphereLight: public Light
{
public:
    HemisphereLight(std::unique_ptr<struct LightProperties> inProperties, glm::vec4 secondColor, LightType type = LightType::HEMISPHERE);
    virtual ~HemisphereLight();

	void HemisphereLight::SetupShaderUniforms(const ShaderProgram* program) const;

private:
    static const std::string LIGHT_UNIFORM_NAME;
    std::unique_ptr<struct LightProperties> properties;

    LightType lightType;

    glm::vec4 secondColor;

    // Attenuation
    float constantAttenuation;
    float linearAttenuation;
    float quadraticAttenuation;
};

#endif
