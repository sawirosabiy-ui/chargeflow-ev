import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface MultiBayStationEnvironmentProps {
  reservedBay?: string;
  isCharging?: boolean;
}

export const MultiBayStationEnvironment: React.FC<MultiBayStationEnvironmentProps> = ({
  reservedBay = 'Bay 03',
  isCharging = true,
}) => {
  const activeBayNum = reservedBay.replace(/[^0-9]/g, '').padStart(2, '0') || '03';

  // 4 Bay stalls matching reference image
  const bays = [
    { id: '01', x: -8.0, label: 'BAY 01' },
    { id: '02', x: -4.0, label: 'BAY 02' },
    { id: '03', x: 0.0, label: 'BAY 03' },
    { id: '04', x: 4.0, label: 'BAY 04' },
  ];

  return (
    <group>
      {/* 1. Realistic Wet Reflective Asphalt Floor with Glossy Puddle Specular Highlights */}
      <mesh position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial 
          color="#060A13" 
          roughness={0.20} 
          metalness={0.72} 
          envMapIntensity={2.2}
        />
      </mesh>

      {/* Decorative Puddle Sheen Layers capturing emerald-green and warm downlight reflections */}
      <mesh position={[0.4, -0.001, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.8, 32]} />
        <meshStandardMaterial color="#050C18" roughness={0.08} metalness={0.88} transparent opacity={0.7} envMapIntensity={2.8} />
      </mesh>
      <mesh position={[-0.8, -0.001, 1.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 32]} />
        <meshStandardMaterial color="#050C18" roughness={0.06} metalness={0.92} transparent opacity={0.65} envMapIntensity={2.8} />
      </mesh>
      <mesh position={[1.4, -0.001, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial color="#050C18" roughness={0.07} metalness={0.90} transparent opacity={0.6} envMapIntensity={2.8} />
      </mesh>

      {/* 2. Station Cantilever Canopy Roof & Warm Recessed Ceiling Spot Downlights (3200K) */}
      {/* Overhead Canopy Ceiling Slab */}
      <mesh position={[0, 4.8, -1.0]}>
        <boxGeometry args={[45, 0.35, 9.0]} />
        <meshStandardMaterial color="#0A0F1D" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Warm Recessed Ceiling Spot Downlights (3200K) casting soft cones of illumination onto wet pavement */}
      {[
        { x: -8.0, z: 0.5 }, { x: -8.0, z: -1.8 },
        { x: -4.0, z: 0.5 }, { x: -4.0, z: -1.8 },
        { x: -0.8, z: 0.8 }, { x: 0.8, z: 0.8 }, { x: 0.0, z: -1.6 },
        { x: 4.0, z: 0.5 },  { x: 4.0, z: -1.8 },
      ].map((downlight, idx) => (
        <group key={`downlight-${idx}`} position={[downlight.x, 4.62, downlight.z]}>
          {/* Recessed Fixture Trim Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.24, 24]} />
            <meshStandardMaterial color="#0A0E17" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Warm 3200K Glowing Frosted Glass Lens */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
            <circleGeometry args={[0.16, 24]} />
            <meshBasicMaterial color="#FFE0B2" />
          </mesh>
          {/* Downward Warm Cone Illumination for Bay 03 & adjacent */}
          {Math.abs(downlight.x) <= 4.0 && (
            <spotLight
              position={[0, -0.02, 0]}
              target-position={[downlight.x, 0, downlight.z]}
              intensity={Math.abs(downlight.x) <= 1.0 ? 3.0 : 1.5}
              color="#FFE0B2"
              angle={Math.PI / 4.8}
              penumbra={0.7}
              distance={7.5}
            />
          )}
        </group>
      ))}

      {/* Overhead Canopy Fascia Trim with Dual Emerald Green (#10B981) Neon Strips */}
      <mesh position={[0, 4.83, 3.52]}>
        <boxGeometry args={[45, 0.56, 0.06]} />
        <meshStandardMaterial color="#040710" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Top Neon Trim Strip */}
      <mesh position={[0, 5.09, 3.56]}>
        <planeGeometry args={[45, 0.022]} />
        <meshBasicMaterial color="#2DD4BF" />
      </mesh>

      {/* Bottom Neon Trim Strip */}
      <mesh position={[0, 4.57, 3.56]}>
        <planeGeometry args={[45, 0.042]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
      <pointLight position={[0, 4.57, 3.8]} intensity={2.2} color="#10B981" distance={7.0} />

      {/* Prominent Glowing Neon "ADDIS EV HUB" Canopy Marquee with Circular Lightning Emblem */}
      <group position={[0.4, 4.83, 3.58]}>
        {/* Slanted Circular Lightning Bolt Emblem on Left of Text */}
        <group position={[-2.45, 0, 0]} rotation={[0, 0, -0.1]}>
          <mesh>
            <ringGeometry args={[0.22, 0.27, 32]} />
            <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
          </mesh>
          <mesh scale={[0.042, 0.042, 0.042]}>
            <shapeGeometry
              args={[
                (() => {
                  const shape = new THREE.Shape();
                  shape.moveTo(0, 4.5);
                  shape.lineTo(-2.8, 0.2);
                  shape.lineTo(-0.2, 0.2);
                  shape.lineTo(-1.8, -4.5);
                  shape.lineTo(3.6, -0.3);
                  shape.lineTo(0.6, -0.3);
                  shape.closePath();
                  return shape;
                })()
              ]}
            />
            <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Text: ADDIS EV HUB */}
        <Text
          position={[0.2, 0, 0]}
          fontSize={0.44}
          color="#10B981"
          anchorX="center"
          anchorY="middle"
          fontWeight="black"
          letterSpacing={0.14}
        >
          ADDIS EV HUB
        </Text>
        <pointLight position={[0, 0, 0.5]} intensity={3.0} color="#10B981" distance={8.0} />
      </group>

      {/* 2.5. Atmospheric Night Sky & City Horizon Backdrop */}
      <group position={[0, 0, -7.5]}>
        {/* Sky Gradient Plane */}
        <mesh position={[0, 5.0, 0]}>
          <planeGeometry args={[45, 12]} />
          <meshBasicMaterial color="#070E1E" />
        </mesh>
        {/* Atmospheric Purple & Cyan City Glow */}
        <mesh position={[2.5, 4.0, 0.05]}>
          <planeGeometry args={[25, 6]} />
          <meshBasicMaterial color="#1E1B4B" transparent opacity={0.65} />
        </mesh>
        <mesh position={[-3.0, 3.5, 0.06]}>
          <planeGeometry args={[20, 5]} />
          <meshBasicMaterial color="#0C2340" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Modern High-Rise City Skyline at Night (Illuminated Skyscrapers, Towers & Lit Windows) */}
      <group position={[0, 0, -6.8]}>
        {/* Center Skyscraper 1: Iconic Purple Crown Tower with Red Beacon (Matching Reference) */}
        <group position={[1.8, 4.2, 0]}>
          <mesh>
            <boxGeometry args={[2.2, 8.4, 1.2]} />
            <meshStandardMaterial color="#0A1024" roughness={0.5} metalness={0.8} />
          </mesh>
          {/* Glowing Purple Crown */}
          <mesh position={[0, 4.25, 0]}>
            <boxGeometry args={[2.24, 0.35, 1.24]} />
            <meshBasicMaterial color="#A855F7" />
          </mesh>
          <pointLight position={[0, 4.3, 0.8]} intensity={1.8} color="#A855F7" distance={4.0} />
          {/* Spire with Red Warning Beacon */}
          <mesh position={[0, 4.8, 0]}>
            <cylinderGeometry args={[0.02, 0.03, 0.8, 8]} />
            <meshBasicMaterial color="#CBD5E1" />
          </mesh>
          <mesh position={[0, 5.22, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
          <pointLight position={[0, 5.22, 0.2]} intensity={0.8} color="#EF4444" distance={2.5} />
          {/* Window Matrix */}
          {Array.from({ length: 9 }).map((_, r) => (
            <mesh key={`c1-win-${r}`} position={[0, (r - 4) * 0.8, 0.62]}>
              <planeGeometry args={[1.8, 0.22]} />
              <meshBasicMaterial color={r % 3 === 0 ? "#67E8F9" : r % 2 === 0 ? "#FEF08A" : "#FFFFFF"} />
            </mesh>
          ))}
        </group>

        {/* Center Skyscraper 2: High-Rise Tower with Illuminated Cross / Spire */}
        <group position={[3.2, 3.6, -0.2]}>
          <mesh>
            <boxGeometry args={[1.8, 7.2, 1.0]} />
            <meshStandardMaterial color="#080D1D" roughness={0.5} metalness={0.7} />
          </mesh>
          {/* White Illuminated Cross Insignia */}
          <group position={[0, 3.8, 0.52]}>
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[0.08, 0.45]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <planeGeometry args={[0.28, 0.08]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            <pointLight position={[0, 0, 0.2]} intensity={1.2} color="#FFFFFF" distance={2.5} />
          </group>
          {/* Windows */}
          {Array.from({ length: 7 }).map((_, r) => (
            <mesh key={`c2-win-${r}`} position={[0, (r - 3) * 0.85, 0.52]}>
              <planeGeometry args={[1.4, 0.24]} />
              <meshBasicMaterial color={r % 2 === 0 ? "#FEF08A" : "#67E8F9"} />
            </mesh>
          ))}
        </group>

        {/* Center Skyscraper 3: Blue Lit Glass Tower */}
        <group position={[4.6, 4.6, 0.1]}>
          <mesh>
            <boxGeometry args={[2.5, 9.2, 1.4]} />
            <meshStandardMaterial color="#0A1226" roughness={0.4} metalness={0.9} />
          </mesh>
          {/* Glowing Cyan/Blue Crown */}
          <mesh position={[0, 4.65, 0]}>
            <boxGeometry args={[2.54, 0.3, 1.44]} />
            <meshBasicMaterial color="#06B6D4" />
          </mesh>
          <pointLight position={[0, 4.7, 0.9]} intensity={1.5} color="#06B6D4" distance={3.5} />
          {/* Windows */}
          {Array.from({ length: 10 }).map((_, r) => (
            <mesh key={`c3-win-${r}`} position={[0, (r - 4.5) * 0.82, 0.72]}>
              <planeGeometry args={[2.1, 0.2]} />
              <meshBasicMaterial color={r % 2 === 0 ? "#67E8F9" : "#FEF08A"} />
            </mesh>
          ))}
        </group>

        {/* Flanking Towers Left & Right */}
        {[
          { x: -14.0, w: 3.2, h: 12.0, z: -0.5, crown: "#3B82F6" },
          { x: -9.5, w: 2.6, h: 9.5, z: 0.2, crown: "#F59E0B" },
          { x: -5.5, w: 3.0, h: 13.0, z: -0.3, crown: "#A855F7" },
          { x: -2.0, w: 2.2, h: 8.0, z: 0.1, crown: "#06B6D4" },
          { x: 7.2, w: 2.8, h: 10.5, z: 0.0, crown: "#A855F7" },
          { x: 11.0, w: 3.5, h: 14.0, z: -0.4, crown: "#3B82F6" },
          { x: 15.5, w: 2.6, h: 8.5, z: 0.2, crown: "#F59E0B" },
        ].map((bld, idx) => (
          <group key={`flank-bld-${idx}`} position={[bld.x, bld.h / 2, bld.z]}>
            <mesh>
              <boxGeometry args={[bld.w, bld.h, 1.6]} />
              <meshStandardMaterial color="#070C1B" roughness={0.6} metalness={0.6} />
            </mesh>
            {/* Crown Lighting */}
            <mesh position={[0, bld.h / 2 + 0.1, 0]}>
              <boxGeometry args={[bld.w + 0.04, 0.24, 1.64]} />
              <meshBasicMaterial color={bld.crown} />
            </mesh>
            {/* Windows */}
            {Array.from({ length: 6 }).map((_, rIdx) => (
              <mesh key={`flank-win-${idx}-${rIdx}`} position={[0, (rIdx - 2.5) * 1.6, 0.82]}>
                <planeGeometry args={[bld.w * 0.75, 0.18]} />
                <meshBasicMaterial color={rIdx % 2 === 0 ? "#FEF08A" : "#67E8F9"} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Perimeter Green Trees & Landscaping silhouetted along station edge */}
      <group position={[0, 0, -4.5]}>
        {[-8.5, -6.8, -4.8, -2.8, -1.0, 1.2, 3.0, 5.2, 7.0, 9.0].map((tx, idx) => (
          <group key={`tree-${idx}`} position={[tx, 1.2, 0]}>
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.95, 12, 12]} />
              <meshStandardMaterial color="#0C2818" roughness={0.8} />
            </mesh>
            <mesh position={[0.2, 0.9, 0.1]}>
              <sphereGeometry args={[0.7, 10, 10]} />
              <meshStandardMaterial color="#14532D" roughness={0.85} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Modern Concrete Planter Boxes with Lush Foliage and Warm Uplights (Matching Reference) */}
      <group position={[0, 0, -2.8]}>
        {/* Planter 1: Behind Active Bay 03 */}
        <group position={[0.8, 0, 0]}>
          {/* Concrete Box */}
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.5, 0.6]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} metalness={0.4} />
          </mesh>
          {/* Lush Green Shrubs */}
          <group position={[0, 0.55, 0]}>
            {[-0.6, -0.2, 0.2, 0.6].map((sx, sIdx) => (
              <mesh key={`shrub-p1-${sIdx}`} position={[sx, 0.15, 0]}>
                <sphereGeometry args={[0.24, 8, 8]} />
                <meshStandardMaterial color="#166534" roughness={0.7} />
              </mesh>
            ))}
          </group>
          {/* Warm 3000K Uplight projecting on leaves */}
          <pointLight position={[0, 0.55, 0.35]} intensity={1.4} color="#FDE68A" distance={2.5} />
        </group>

        {/* Planter 2: Beside Bay 04 */}
        <group position={[3.6, 0, 0]}>
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.5, 0.6]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} metalness={0.4} />
          </mesh>
          <group position={[0, 0.55, 0]}>
            {[-0.5, 0, 0.5].map((sx, sIdx) => (
              <mesh key={`shrub-p2-${sIdx}`} position={[sx, 0.18, 0]}>
                <sphereGeometry args={[0.26, 8, 8]} />
                <meshStandardMaterial color="#15803D" roughness={0.7} />
              </mesh>
            ))}
          </group>
          <pointLight position={[0, 0.55, 0.35]} intensity={1.4} color="#FDE68A" distance={2.5} />
        </group>

        {/* Planter 3: Beside Bay 02 */}
        <group position={[-3.6, 0, 0]}>
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.5, 0.6]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} metalness={0.4} />
          </mesh>
          <group position={[0, 0.55, 0]}>
            {[-0.5, 0, 0.5].map((sx, sIdx) => (
              <mesh key={`shrub-p3-${sIdx}`} position={[sx, 0.18, 0]}>
                <sphereGeometry args={[0.26, 8, 8]} />
                <meshStandardMaterial color="#166534" roughness={0.7} />
              </mesh>
            ))}
          </group>
          <pointLight position={[0, 0.55, 0.35]} intensity={1.4} color="#FDE68A" distance={2.5} />
        </group>
      </group>

      {/* Industrial Station Pillars between bays with Illuminated Signs */}
      {/* Bay 02 Pillar (Left) */}
      <group position={[-4.0, 0, -2.6]}>
        <mesh position={[0, 2.4, 0]} castShadow>
          <boxGeometry args={[0.48, 4.8, 0.48]} />
          <meshStandardMaterial color="#0A101D" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Neon Green Vertical Edge Light Blades */}
        <mesh position={[-0.245, 2.4, 0]}>
          <boxGeometry args={[0.02, 4.7, 0.48]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        {/* Illuminated BAY 02 Sign */}
        <group position={[0, 2.8, 0.25]}>
          <Text
            fontSize={0.28}
            color="#10B981"
            anchorX="center"
            anchorY="middle"
            fontWeight="black"
            letterSpacing={0.08}
          >
            BAY{"\n"}02
          </Text>
          <pointLight position={[0, 0, 0.3]} intensity={1.5} color="#10B981" distance={3.0} />
        </group>
      </group>

      {/* Bay 04 Pillar (Right) */}
      <group position={[4.0, 0, -2.6]}>
        <mesh position={[0, 2.4, 0]} castShadow>
          <boxGeometry args={[0.48, 4.8, 0.48]} />
          <meshStandardMaterial color="#0A101D" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Neon Green Vertical Edge Light Blades */}
        <mesh position={[0.245, 2.4, 0]}>
          <boxGeometry args={[0.02, 4.7, 0.48]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        {/* Illuminated BAY 04 Sign */}
        <group position={[0, 2.8, 0.25]}>
          <Text
            fontSize={0.28}
            color="#10B981"
            anchorX="center"
            anchorY="middle"
            fontWeight="black"
            letterSpacing={0.08}
          >
            BAY{"\n"}04
          </Text>
          <pointLight position={[0, 0, 0.3]} intensity={1.5} color="#10B981" distance={3.0} />
        </group>
      </group>

      {/* Tall Industrial Streetlamp Poles with Warm Cones of Light */}
      {[
        { x: -5.8, z: -3.6 },
        { x: 5.8, z: -3.6 }
      ].map((lamp, idx) => (
        <group key={`streetlamp-${idx}`} position={[lamp.x, 0, lamp.z]}>
          {/* Tall Pole */}
          <mesh position={[0, 2.3, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 4.6, 12]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Dual Lamp Fixture Head */}
          <mesh position={[0, 4.6, 0]}>
            <boxGeometry args={[0.6, 0.08, 0.2]} />
            <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Glowing Lenses */}
          <mesh position={[-0.2, 4.55, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
          <mesh position={[0.2, 4.55, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
          <pointLight position={[0, 4.5, 0]} intensity={1.8} color="#FEF08A" distance={6.0} />
        </group>
      ))}

      {/* 3. Each Bay's Floor Demarcation, Illuminated Bollards & Overhead Bay Sign */}
      {bays.map((bay) => {
        const isActive = bay.id === activeBayNum || (bay.id === '03' && !['01', '02', '03', '04'].includes(activeBayNum));
        const lineColor = isActive ? '#10B981' : '#1E293B';
        const textColor = isActive ? '#10B981' : '#34D399';

        return (
          <group key={bay.id} position={[bay.x, 0, 0]}>
            {/* Ground Stall Marking Lines */}
            <group position={[0, 0.001, 0]}>
              {/* Left Line */}
              <mesh position={[-1.85, 0, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.05, 5.4]} />
                <meshBasicMaterial color={lineColor} />
              </mesh>
              {/* Right Line */}
              <mesh position={[1.85, 0, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.05, 5.4]} />
                <meshBasicMaterial color={lineColor} />
              </mesh>
              {/* Rear Limit Line */}
              <mesh position={[0, 0, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[3.75, 0.05]} />
                <meshBasicMaterial color={lineColor} />
              </mesh>
              {/* Front Limit Line */}
              <mesh position={[0, 0, 2.9]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[3.75, 0.05]} />
                <meshBasicMaterial color={lineColor} />
              </mesh>

              {/* Large Glowing Bay Stencil on Floor (Matching Reference Image) */}
              <group position={[0, 0.002, 2.2]} rotation={[-Math.PI / 2, 0, 0]}>
                <Text
                  fontSize={0.48}
                  color={textColor}
                  anchorX="center"
                  anchorY="middle"
                  fillOpacity={isActive ? 0.98 : 0.45}
                  fontWeight="black"
                  letterSpacing={0.06}
                >
                  {bay.label}
                </Text>
              </group>
            </group>

            {/* Glowing Station Bollards between bays */}
            <group position={[-1.85, 0, 1.8]}>
              <mesh position={[0, 0.35, 0]}>
                <cylinderGeometry args={[0.045, 0.045, 0.7, 16]} />
                <meshStandardMaterial color="#0B1220" roughness={0.4} metalness={0.9} />
              </mesh>
              <mesh position={[0, 0.65, 0]}>
                <cylinderGeometry args={[0.043, 0.043, 0.1, 16]} />
                <meshBasicMaterial color={isActive ? "#10B981" : "#334155"} />
              </mesh>
              {isActive && (
                <pointLight position={[0, 0.65, 0]} intensity={0.5} color="#10B981" distance={2.0} />
              )}
            </group>

            <group position={[1.85, 0, 1.8]}>
              <mesh position={[0, 0.35, 0]}>
                <cylinderGeometry args={[0.045, 0.045, 0.7, 16]} />
                <meshStandardMaterial color="#0B1220" roughness={0.4} metalness={0.9} />
              </mesh>
              <mesh position={[0, 0.65, 0]}>
                <cylinderGeometry args={[0.043, 0.043, 0.1, 16]} />
                <meshBasicMaterial color={isActive ? "#10B981" : "#334155"} />
              </mesh>
              {isActive && (
                <pointLight position={[0, 0.65, 0]} intensity={0.5} color="#10B981" distance={2.0} />
              )}
            </group>

            {/* Overhead Bay Sign Box on Canopy Fascia (Visible above each bay) */}
            <group position={[0, 3.75, 1.2]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.5, 0.42, 0.08]} />
                <meshStandardMaterial color="#050811" roughness={0.3} metalness={0.9} />
              </mesh>
              <mesh position={[0, 0, 0.042]}>
                <planeGeometry args={[1.45, 0.38]} />
                <meshBasicMaterial color={isActive ? "#064E3B" : "#0A0F1D"} />
              </mesh>
              <group position={[0, 0, 0.046]}>
                <Text
                  fontSize={0.24}
                  color={textColor}
                  anchorX="center"
                  anchorY="middle"
                  fontWeight="bold"
                >
                  {bay.label}
                </Text>
              </group>
              {isActive && (
                <pointLight position={[0, -0.1, 0.5]} intensity={1.8} color="#10B981" distance={5.5} />
              )}
            </group>

            {/* Standby Charger Units for other bays with Glowing Green Lightning Bolts */}
            {!isActive && (
              <group position={[1.85, 0, 0.2]} rotation={[0, -0.35, 0]}>
                <mesh position={[0, 0.95, 0]}>
                  <boxGeometry args={[0.38, 1.9, 0.28]} />
                  <meshStandardMaterial color="#090E1B" roughness={0.4} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.95, 0.145]}>
                  <planeGeometry args={[0.3, 1.75]} />
                  <meshBasicMaterial color="#03060F" />
                </mesh>
                {/* Standby Glowing Green Lightning Bolt Logo */}
                <group position={[0, 1.45, 0.15]}>
                  <mesh scale={[0.024, 0.024, 0.024]}>
                    <shapeGeometry
                      args={[
                        (() => {
                          const shape = new THREE.Shape();
                          shape.moveTo(0, 6);
                          shape.lineTo(-3.8, 0.2);
                          shape.lineTo(-0.2, 0.2);
                          shape.lineTo(-2.2, -6);
                          shape.lineTo(4.8, -0.6);
                          shape.lineTo(0.8, -0.6);
                          shape.closePath();
                          return shape;
                        })()
                      ]}
                    />
                    <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
                  </mesh>
                  <pointLight position={[0, 0, 0.1]} intensity={0.8} color="#10B981" distance={2.0} />
                </group>
              </group>
            )}
          </group>
        );
      })}

      {/* 4. Overhead Studio Downlight on Active Bay */}
      <spotLight
        position={[0, 7.5, 2.0]}
        target-position={[0, 0, 0]}
        intensity={3.2}
        color="#FFFFFF"
        angle={Math.PI / 4}
        penumbra={0.6}
        castShadow
      />
      {isCharging && (
        <pointLight position={[0, 0.2, 0.5]} intensity={1.0} color="#10B981" distance={4.0} />
      )}
    </group>
  );
};

export default MultiBayStationEnvironment;
