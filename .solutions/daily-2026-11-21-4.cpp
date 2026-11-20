#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    string line;
    getline(cin, line);
    n = stoi(line);
    map<string, array<long long, 3>> stat;
    for (int i = 0; i < n; i++) {
        getline(cin, line);
        if (!line.empty() && line.back() == '\r') line.pop_back();
        stringstream ss(line);
        string tok, user;
        long long status = 0, size = 0;
        while (ss >> tok) {
            size_t eq = tok.find('=');
            string key = tok.substr(0, eq), value = tok.substr(eq + 1);
            if (key == "user") user = value;
            else if (key == "status") status = stoll(value);
            else if (key == "bytes") size = stoll(value);
        }
        auto &s = stat[user];
        if (status < 400) {
            s[0]++;
            s[2] += size;
        } else {
            s[1]++;
        }
    }
    for (auto &e : stat)
        cout << e.first << ' ' << e.second[0] << ' ' << e.second[1] << ' ' << e.second[2] << '\n';
    return 0;
}
