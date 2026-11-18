#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, lo, hi;
    cin >> n >> lo >> hi;
    vector<string> ok;
    int bad = 0;
    string last = "";
    for (int i = 0; i < n; i++) {
        string code;
        int w;
        cin >> code >> w;
        bool dup = (i > 0 && code == last);
        if (!dup && lo <= w && w <= hi) ok.push_back(code);
        else bad++;
        last = code;
    }
    if (ok.empty()) cout << "NONE\n";
    else {
        for (size_t i = 0; i < ok.size(); i++) cout << (i ? " " : "") << ok[i];
        cout << "\n";
    }
    cout << bad << "\n";
    return 0;
}
