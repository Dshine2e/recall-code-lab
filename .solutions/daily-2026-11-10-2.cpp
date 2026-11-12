#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> a(n), ans(n, -1);
    for (auto& x : a) cin >> x;
    vector<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && a[st.back()] < a[i]) { ans[st.back()] = a[i]; st.pop_back(); }
        st.push_back(i);
    }
    for (int i = 0; i < n; i++) cout << (i ? " " : "") << ans[i];
    cout << '\n';
}
