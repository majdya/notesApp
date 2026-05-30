import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '../store/hooks';
import { RootTabParamList } from '../navigation/AppNavigator';

type MapNav = BottomTabNavigationProp<RootTabParamList>;

function generateMapHtml(
  notes: {
    id: string;
    title: string;
    content: string;
    latitude: number;
    longitude: number;
  }[],
) {
  const safeNotes = JSON.stringify(notes);
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { height: 100%; width: 100%; }
    .cluster-icon {
      background-color: #00994E; color: white; border-radius: 50%;
      width: 40px; height: 40px; display: flex;
      align-items: center; justify-content: center;
      font-weight: bold; font-size: 16px;
      border: 3px solid #00cc66; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    .cluster-item { cursor: pointer; padding: 4px 0; }
    .cluster-item:hover { color: #00994E; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var notes = ${safeNotes};
    var map = L.map('map');
    var bounds = [];
    var groups = {};
    notes.forEach(function(n) {
      var key = n.latitude.toFixed(4) + ',' + n.longitude.toFixed(4);
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    Object.keys(groups).forEach(function(key) {
      var group = groups[key];
      var parts = key.split(',');
      var lat = parseFloat(parts[0]);
      var lng = parseFloat(parts[1]);
      if (group.length === 1) {
        var n = group[0];
        var marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup('<b>' + n.title + '</b><br/>' + (n.content || ''));
        marker.on('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', noteId: n.id }));
        });
      } else {
        var marker = L.marker([lat, lng], {
          icon: L.divIcon({
            html: '<div class="cluster-icon">' + group.length + '</div>',
            className: '',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          }),
        }).addTo(map);
        var popupHtml = '<div class="cluster-popup">' + group.map(function(n) {
          return '<div class="cluster-item" data-id="' + n.id + '"><b>' + n.title + '</b></div>';
        }).join('') + '</div>';
        marker.bindPopup(popupHtml);
        marker.on('popupopen', function() {
          document.querySelectorAll('.cluster-item').forEach(function(el) {
            el.onclick = function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', noteId: el.getAttribute('data-id') }));
            };
          });
        });
      }
      bounds.push([lat, lng]);
    });
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([32.794, 34.9896], 10);
    }
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    setTimeout(function() { map.invalidateSize(); }, 300);
  </script>
</body>
</html>`;
}

function MapScreen() {
  const navigation = useNavigation<MapNav>();
  const notes = useAppSelector(state =>
    state.notes.notes.filter(
      (n): n is typeof n & { latitude: number; longitude: number } =>
        n.latitude != null && n.longitude != null,
    ),
  );

  if (notes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-lg font-semibold text-text-primary">
          No pinned notes yet
        </Text>
        <Text className="mt-1 text-sm text-text-secondary">
          Notes with a location will appear here
        </Text>
      </View>
    );
  }

  return (
    <WebView
      className="flex-1"
      source={{ html: generateMapHtml(notes) }}
      javaScriptEnabled
      onMessage={event => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'markerPress') {
          navigation.navigate('NotesTab', {
            screen: 'NoteDetail',
            params: { noteId: data.noteId },
          });
        }
      }}
    />
  );
}

export default MapScreen;
