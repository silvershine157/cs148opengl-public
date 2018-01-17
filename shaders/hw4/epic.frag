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

vec4 pointLightSubroutine(vec4 worldPosition, vec3 worldNormal, vec4 lightDirection, bool isHemisphere){
  vec4 diffuseColor = (1-material.matMetallic)*fragmentColor;
  vec4 specularColor = mix(material.matSpecular*vec4(0.08), fragmentColor, material.matMetallic);

  float pi = 3.1415f;
  vec4 d = diffuseColor / pi;
  //vec4 d = diffuseColor;
  float alpha = material.matRoughness * material.matRoughness;

  vec4 N = vec4(normalize(worldNormal), 0.f);

  vec4 L;

  vec4 lightColor = genericLight.singleColor;
  if(isHemisphere){
    //hemisphere
    L = N;
    lightColor = mix(hemisphereLight.secondColor, genericLight.singleColor, clamp(0.5+0.5*dot(N, vec4(0,1,0,0)),0,1));
  }
  else if(length(lightDirection)<0.1){
    //pointlight
    L = normalize(pointLight.pointPosition - worldPosition);
  }
  else{
    //directional
    L = lightDirection; //already normalized
  }

  vec4 V = normalize(cameraPosition - worldPosition);
  vec4 H = normalize(L + V);

  float k = pow(material.matRoughness + 1,2.0)/8.0;
  float G = G_one(L, N, k)*G_one(V, N, k);
  float D = (alpha*alpha)/(pi*pow(pow(dot(N,H),2.0)*(alpha*alpha-1) + 1, 2.0));
  float expnt = (-5.55473*dot(V, H)-6.98316)*dot(V, H);
  vec4 F = specularColor + (vec4(1) - specularColor)*pow(2, expnt);

  vec4 s = (D*G/(4*dot(N, L)*dot(N, V)))*F;

  if(dot(N,L)>0){
    return lightColor*dot(N,L)*(d+s);
  }
  return vec4(0);
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
        lightingColor = pointLightSubroutine(vertexWorldPosition, vertexWorldNormal, vec4(0), false);
        finalColor = AttenuateLight(lightingColor, vertexWorldPosition) * fragmentColor;
        return;
    } else if (lightingType == 2) {
        vec4 Lhat = normalize(directionalLight.direction);
        lightingColor = pointLightSubroutine(vertexWorldPosition, vertexWorldNormal, Lhat, false);
    } else if (lightingType == 3){
        lightingColor = pointLightSubroutine(vertexWorldPosition, vertexWorldNormal, vec4(0), true);
    }
    finalColor = lightingColor * fragmentColor;
}
