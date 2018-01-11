#version 330

out vec4 fragColor;
in float param;

uniform float inputTime;

void main()
{
    vec4 finalColor = vec4(1);

    // Insert your code for "Slightly-More Advanced Shaders" here.
    float rate = 2.0;
    finalColor[0] = 0.5 + param*0.35 + 0.15*cos(rate*1.414*inputTime);
    finalColor[1] = 0.5 + param*0.35 + 0.15*cos(rate*3.1416*inputTime);
    finalColor[2] = 0.5 + param*0.35 + 0.15*cos(rate*2.71*inputTime);

    fragColor = finalColor;
}
