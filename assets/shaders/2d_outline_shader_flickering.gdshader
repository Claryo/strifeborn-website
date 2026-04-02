shader_type canvas_item;

render_mode unshaded;

uniform vec3 line_colour: source_color = vec3(1.0);
uniform int line_thickness: hint_range(0, 10) = 1;
uniform float flicker_speed : hint_range(0.0, 10.0, 0.1) = 2.0; // Vitesse de scintillement avec pas de 0.1
uniform float flicker_min : hint_range(0.0, 1.0, 0.1) = 0.2; // Valeur minimale de scintillement avec pas de 0.1
uniform sampler2D screen_texture : hint_screen_texture, repeat_disable, filter_nearest;

void fragment() {
    vec2 size = SCREEN_PIXEL_SIZE * float(line_thickness);
    float line_alpha = 0.0;
    
    // Calcul de l'alpha du contour
    for (float i = -size.x; i <= size.x; i += SCREEN_PIXEL_SIZE.x) {
        for (float j = -size.y; j <= size.y; j += SCREEN_PIXEL_SIZE.y) {
            line_alpha += texture(screen_texture, SCREEN_UV + vec2(i, j)).a;
        }
    }
    
    // Scintillement
    float phase = sin(TIME * flicker_speed);
    float flicker = mix(flicker_min, 1.0, (phase + 1.0) / 2.0); // Remonte de flicker_min à 1.0
    
    vec4 colour = texture(screen_texture, SCREEN_UV);
    vec4 outline = vec4(line_colour, min(line_alpha, 1.0) * flicker); // Applique le flicker à l'alpha du contour
    
    // Mélange de la couleur du contour avec la couleur de l'image
    COLOR = mix(outline, colour, colour.a);
}
