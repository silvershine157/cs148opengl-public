#version 330

in vec4 fragmentColor;
in vec4 vertexWorldPosition;
in vec3 vertexWorldNormal;

out vec4 finalColor;

uniform InputMaterial {
    float matRoughness;
    float matSpecular;
    float matMetallic;
} material;

struct LightProperties {
    vec4 singleColor;
};
uniform LightProperties genericLight;

struct PointLight {
    vec4 pointPosition;
};
uniform PointLight pointLight;

struct HemisphereLight {
  vec4 secondColor;
};
uniform HemisphereLight hemisphereLight;

struct DirectionalLight{
  vec4 direction;
};
uniform DirectionalLight directionalLight;

uniform vec4 cameraPosition;

uniform float constantAttenuation;
uniform float linearAttenuation;
uniform float quadraticAttenuation;

uniform int lightingType;

float G_one(vec4 v, vec4 N, float k){
  float vdN = dot(v, N);
  return vdN/(vdN*(1-k)+k);
}

vec4 pointLightSubroutine(vec4 worldPosition, vec3 worldNormal){
  vec4 diffuseColor = (1-material.matMetallic)*fragmentColor;
  vec4 specularColor = mix(material.matSpecular*vec4(0.08), fragmentColor, material.matMetallic);

  float pi = 3.1415f;
  vec4 d = diffuseColor / pi;
  //vec4 d = diffuseColor;
  float alpha = material.matRoughness * material.matRoughness;

  vec4 N = vec4(normalize(worldNormal), 0.f);
  vec4 L = normalize(pointLight.pointPosition - worldPosition);
  vec4 V = normalize(cameraPosition - worldPosition);
  vec4 H = normalize(L + V);

  float k = pow(material.matRoughness + 1,2.0)/8.0;
  float G = G_one(L, N, k)*G_one(V, N, k);
  float D = (alpha*alpha)/(pi*pow(pow(dot(N,H),2.0)*(alpha*alpha-1) + 1, 2.0));
  float expnt = (-5.55473*dot(V, H)-6.98316)*dot(V, H);
  vec4 F = specularColor + (vec4(1) - specularColor)*pow(2, expnt);

  vec4 s = (D*G/(4*dot(N, L)*dot(N, V)))*F;

  //return max(vec4(0), dot(N, L)*(d) + s_);
  if(dot(N,L)>0){
    return genericLight.singleColor*dot(N,L)*(d+s);
  }
  return vec4(0);

  //return max(vec4(0), );
}

vec4 globalLightSubroutine(vec4 worldPosition, vec3 worldNormal)
{
    // return material.matAmbient;
    return vec4(0);
}

vec4 AttenuateLight(vec4 originalColor, vec4 worldPosition)
{
    float lightDistance = length(pointLight.pointPosition - worldPosition);
    float num = clamp(1-pow(lightDistance/100, 4), 0, 1);
    float attenuation = num / (constantAttenuation + lightDistance * linearAttenuation + lightDistance * lightDistance * quadraticAttenuation);
    return originalColor * attenuation;
}

void main()
{
    vec4 lightingColor = vec4(0);
    if (lightingType == 0) {
        lightingColor = globalLightSubroutine(vertexWorldPosition, vertexWorldNormal);
    } else if (lightingType == 1) {
        lightingColor = pointLightSubroutine(vertexWorldPosition, vertexWorldNormal);
    } else if (lightingType == 2) {
        lightingColor = pointLightSubroutine(vertexWorldPosition, vertexWorldNormal);
    }
    finalColor = AttenuateLight(lightingColor, vertexWorldPosition) * fragmentColor;
    //finalColor = lightingColor;
}
