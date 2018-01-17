#include "common/Scene/Light/DirectionalLight.h"
#include "common/Scene/Light/LightProperties.h"
#include "common/Rendering/Shaders/ShaderProgram.h"

const std::string DirectionalLight::LIGHT_UNIFORM_NAME = "directionalLight";

DirectionalLight::DirectionalLight(std::unique_ptr<LightProperties> inProperties, glm::vec3 direction, LightType type):
    Light(move(inProperties), type), direction(direction)
{

}

DirectionalLight::~DirectionalLight()
{
}

void DirectionalLight::SetupShaderUniforms(const ShaderProgram* program) const
{

    program->SetShaderUniform(LIGHT_UNIFORM_NAME + ".direction", glm::vec4(direction, 0));
}
