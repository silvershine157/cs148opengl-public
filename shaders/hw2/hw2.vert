#version 330

layout(location = 0) in vec4 vertexPosition;

uniform float inputTime;
out float param;

void main()
{
    vec4 modifiedVertexPosition = vertexPosition;

    // Insert your code for "Slightly-More Advanced Shaders" here.

    param = cos(1.5*inputTime);
    float ofs = 0.5-0.5*param;
    modifiedVertexPosition[1] -= ofs;

    gl_Position = modifiedVertexPosition;
}
