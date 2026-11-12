#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<string, int>> menus;  // 등장 순서대로 (이름, 합계)
    for (int i = 0; i < n; i++) {
        string name;
        int q;
        cin >> name >> q;
        bool found = false;
        for (auto &m : menus) {
            if (m.first == name) {
                m.second += q;
                found = true;
                break;
            }
        }
        if (!found) menus.push_back({name, q});
    }
    for (auto &m : menus) cout << m.first << ' ' << m.second << '\n';
    return 0;
}
