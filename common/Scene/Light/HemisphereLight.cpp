#include "common/Scene/Light/HemisphereLight.h"
#include "common/Scene/Light/LightProperties.h"
#include "common/Rendering/Shaders/ShaderProgram.h"

const std::string HemisphereLight::LIGHT_UNIFORM_NAME = "hemisphereLight";

HemisphereLight::HemisphereLight(std::unique_ptr<LightProperties> inProperties, glm::vec4 secondColor, LightType type):
    Light(move(inProperties), type), secondColor(secondColor)
{
	
}

HemisphereLight::~HemisphereLight()
{
}

void HemisphereLight::SetupShaderUniforms(const ShaderProgram* program) const
{

    program->SetShaderUniform(LIGHT_UNIFORM_NAME + ".secondColor", secondColor);
}
