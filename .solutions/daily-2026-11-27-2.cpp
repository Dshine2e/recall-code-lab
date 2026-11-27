#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, int> total;
    vector<string> order;
    for (int i = 0; i < n; i++) {
        string name;
        int q;
        cin >> name >> q;
        if (total.find(name) == total.end()) {
            order.push_back(name);
            total[name] = 0;
        }
        total[name] += q;
    }
    string best;
    int bestv = -1;
    for (const string& s : order) {
        cout << s << ' ' << total[s] << '\n';
        if (total[s] > bestv) {
            bestv = total[s];
            best = s;
        }
    }
    cout << best << '\n';
    return 0;
}
